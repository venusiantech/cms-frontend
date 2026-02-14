'use client';

import Link from 'next/link';
import Pagination from '@/templates/templateA/components/elements/Pagination';
import { useState } from 'react';
import Image from 'next/image';

export interface CommentItem {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  parentId?: number;
}

interface CommentsProps {
  comments?: CommentItem[];
}

export default function Comments({ comments = [] }: CommentsProps) {
  const topLevelComments = comments.filter((c) => !c.parentId);
  const replies = comments.filter((c) => c.parentId);
  const commentsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(topLevelComments.length / commentsPerPage));

  const handlePageChange = (page: number) => setCurrentPage(page);

  const startIdx = (currentPage - 1) * commentsPerPage;
  const endIdx = startIdx + commentsPerPage;
  const paginatedComments = topLevelComments.slice(startIdx, endIdx);

  function renderReplies(parentId: number) {
    return replies
      .filter((reply) => reply.parentId === parentId)
      .map((reply) => (
        <div key={reply.id} className="single-comment depth-2 justify-content-between d-flex ms-5">
          <div className="user justify-content-between d-flex">
            <div className="thumb">
              <Image src={reply.avatar} alt="user avatar" width={50} height={50} unoptimized />
            </div>
            <div className="desc">
              <p className="comment">{reply.content}</p>
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <h6>
                    <Link href="#">{reply.author}</Link>
                  </h6>
                  <p className="date">{reply.date}</p>
                </div>
                <div className="reply-btn">
                  <Link className="btn-reply" href="#">Reply</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ));
  }

  return (
    <>
      <div className="single-comment comments_wrap">
        <div className="comments-area mb-5">
          <div className="widget-header-2 position-relative mb-3">
            <h3 id="reply-title" className="comment-reply-title">
              Comments ({comments.length})
            </h3>
          </div>
          {paginatedComments.length === 0 ? (
            <p className="text-muted">No comments yet.</p>
          ) : (
            paginatedComments.map((comment) => (
              <div className="comment-list" key={comment.id}>
                <div className="single-comment justify-content-between d-flex">
                  <div className="user justify-content-between d-flex">
                    <div className="thumb">
                      <Image src={comment.avatar} alt="user avatar" width={40} height={40} unoptimized />
                    </div>
                    <div className="desc">
                      <p className="comment">{comment.content}</p>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                          <h6>
                            <Link href="#">{comment.author}</Link>
                          </h6>
                          <p className="date">{comment.date}</p>
                        </div>
                        <div className="reply-btn">
                          <Link className="btn-reply" href="#">Reply</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {renderReplies(comment.id)}
              </div>
            ))
          )}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        {/* <section id="comments">
          <div className="comments-inner clr">
            <div id="respond" className="comment-respond">
              <h3 id="reply-title" className="comment-reply-title">
                Leave a Reply
              </h3>
              <form action="#" method="post" id="commentform" className="comment-form" noValidate>
                <p className="comment-notes">
                  <span id="email-notes">Your email address will not be published.</span> Required fields are marked <span className="required">*</span>
                </p>
                <p className="comment-form-comment">
                  <label htmlFor="comment">Comment</label>
                  <textarea id="comment" name="comment" cols={45} rows={8} maxLength={65525} required defaultValue={''} />
                </p>
                <div className="row">
                  <div className="comment-form-author col-sm-12 col-md-6">
                    <p>
                      <label htmlFor="author">Name*</label>
                      <input id="author" name="author" type="text" defaultValue="" size={30} aria-required="true" />
                    </p>
                  </div>
                  <div className="comment-form-email col-sm-12 col-md-6">
                    <p>
                      <label htmlFor="email">Email*</label>
                      <input id="email" name="email" type="email" defaultValue="" size={30} aria-required="true" />
                    </p>
                  </div>
                </div>
                <p className="form-submit">
                  <input name="submit" type="submit" id="submit" className="submit btn btn-success btn-block" defaultValue="Post Comment" />
                </p>
              </form>
            </div>
          </div>
        </section> */}
      </div>
    </>
  );
}
