'use client'

import React, { Fragment } from 'react'

function linkifyText(text: string): (string | JSX.Element)[] {
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: (string | JSX.Element)[] = []
  let lastIndex = 0
  let match
  while ((match = mdLinkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index))
    parts.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline dark:text-primary-400">
        {match[1]}
      </a>
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex))
  if (parts.length === 0) {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.split(urlRegex).map((part, i) =>
      typeof part === 'string' && urlRegex.test(part) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline dark:text-primary-400">{part}</a>
      ) : (
        part
      )
    )
  }
  return parts
}

function formatInline(text: string, keyPrefix: string): (string | JSX.Element)[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.flatMap((part, i) => {
    if (part.match(/^\*\*.*\*\*$/)) return [<strong key={`${keyPrefix}-b-${i}`}>{part.slice(2, -2)}</strong>]
    if (part.match(/^\*.*\*$/)) return [<em key={`${keyPrefix}-i-${i}`}>{part.slice(1, -1)}</em>]
    if (part.match(/^`.*`$/)) return [<code key={`${keyPrefix}-c-${i}`} className="rounded bg-neutral-200 px-1 dark:bg-[#404040]">{part.slice(1, -1)}</code>]
    return linkifyText(part).map((p, j) => (typeof p === 'string' ? p : <Fragment key={`${keyPrefix}-l-${i}-${j}`}>{p}</Fragment>))
  })
}

function parseTableRow(line: string): string[] {
  const cells = line.split('|').map((s) => s.trim())
  if (cells[0] === '') cells.shift()
  if (cells[cells.length - 1] === '') cells.pop()
  return cells
}

function isTableSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^[-:\s]+$/.test(c))
}

function formatCellContent(text: string, keyPrefix: string): (string | JSX.Element)[] {
  return text.split(/(\*\*[^*]+\*\*)/g).flatMap((part, i) =>
    part.match(/^\*\*.*\*\*$/)
      ? [<strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>]
      : [<Fragment key={`${keyPrefix}-${i}`}>{linkifyText(part)}</Fragment>]
  )
}

function renderMarkdown(content: string, articleTitle: string): (JSX.Element | null)[] {
  if (!content || !content.trim()) return []
  const clean = content.replace(/```markdown\n?/g, '').replace(/```\n?/g, '').trim()
  const lines = clean.split('\n')
  let startIndex = 0
  if (lines[0]?.startsWith('# ')) {
    const firstH = lines[0].substring(2).trim()
    if (
      firstH.toLowerCase().includes((articleTitle || '').toLowerCase().substring(0, 20)) ||
      (articleTitle || '').toLowerCase().includes(firstH.toLowerCase().substring(0, 20))
    ) {
      startIndex = 1
    }
  }
  const result: (JSX.Element | null)[] = []
  let keyIdx = 0
  const slice = lines.slice(startIndex)
  for (let i = 0; i < slice.length; i++) {
    const line = slice[i]
    if (line.trim() === '```' || line.trim() === '```markdown') continue
    if (line.trim() === '') {
      result.push(<div key={keyIdx++} className="h-3" />)
      continue
    }
    // Tables: lines starting with |
    if (line.trim().startsWith('|')) {
      const tableRows: string[][] = []
      let j = i
      while (j < slice.length && slice[j].trim().startsWith('|')) {
        tableRows.push(parseTableRow(slice[j]))
        j++
      }
      if (tableRows.length >= 1) {
        const isSep = tableRows.length > 1 && isTableSeparatorRow(tableRows[1])
        const headerRow = tableRows[0]
        const bodyRows = isSep ? tableRows.slice(2) : tableRows.slice(1)
        result.push(
          <div key={keyIdx++} className="my-4 overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-200 dark:border-neutral-600">
              <thead>
                <tr className="bg-neutral-100 dark:bg-[#262626]">
                  {headerRow.map((cell, c) => (
                    <th key={c} className="border border-neutral-200 px-3 py-2 text-left font-semibold dark:border-neutral-600 dark:text-neutral-200">
                      {formatCellContent(cell, `th-${keyIdx}-${c}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, r) => (
                  <tr key={r} className={r % 2 === 0 ? 'bg-white dark:bg-[#0a0a0a]' : 'bg-neutral-50 dark:bg-[#262626]/50'}>
                    {row.map((cell, c) => (
                      <td key={c} className="border border-neutral-200 px-3 py-2 text-neutral-900 dark:border-neutral-600 dark:text-neutral-300">
                        {formatCellContent(cell, `td-${keyIdx}-${r}-${c}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        i = j - 1
        continue
      }
    }
    if (line.startsWith('# ')) {
      result.push(<h1 key={keyIdx++} className="mb-4 mt-6 text-2xl font-bold">{formatInline(line.substring(2), `h1-${keyIdx}`)}</h1>)
      continue
    }
    if (line.startsWith('## ')) {
      result.push(<h2 key={keyIdx++} className="mb-3 mt-5 text-xl font-semibold">{formatInline(line.substring(3), `h2-${keyIdx}`)}</h2>)
      continue
    }
    if (line.startsWith('### ')) {
      result.push(<h3 key={keyIdx++} className="mb-2 mt-4 text-lg font-semibold">{formatInline(line.substring(4), `h3-${keyIdx}`)}</h3>)
      continue
    }
    if (line.startsWith('> ')) {
      result.push(<blockquote key={keyIdx++} className="border-primary-500 border-s-4 ps-4 italic">{formatInline(line.substring(2), `bq-${keyIdx}`)}</blockquote>)
      continue
    }
    if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      result.push(<hr key={keyIdx++} className="my-6 border-neutral-200 dark:border-neutral-700" />)
      continue
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      result.push(<li key={keyIdx++} className="ml-4 list-disc">{formatInline(line.substring(2), `ul-${keyIdx}`)}</li>)
      continue
    }
    if (/^\d+\.\s/.test(line)) {
      result.push(<li key={keyIdx++} className="ml-4 list-decimal">{formatInline(line.replace(/^\d+\.\s/, ''), `ol-${keyIdx}`)}</li>)
      continue
    }
    result.push(<p key={keyIdx++} className="mb-4">{formatInline(line, `p-${keyIdx}`)}</p>)
  }
  return result.filter(Boolean)
}

interface TheContentProps {
  content: string
  title?: string
}

const TheContent = ({ content, title = '' }: TheContentProps) => {
  const bodyContent = content?.trim()
    ? renderMarkdown(content, title)
    : []

  if (bodyContent.length === 0) {
    return null
  }

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {bodyContent}
    </div>
  )
}

export default TheContent
