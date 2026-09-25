type CourseIconProps = {
  className?: string;
};

export function CourseIcon({ className = "h-5 w-5" }: CourseIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20M8 7h8M8 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
