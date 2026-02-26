'use client';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function TabButton({ active, onClick, icon, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pb-4 border-b-2 transition-all duration-200 ${
        active
          ? 'border-neutral-100 text-neutral-100'
          : 'border-transparent text-neutral-500 hover:text-neutral-300'
      }`}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </button>
  );
}
