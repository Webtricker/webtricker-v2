export const ArrowDownIcon = ({
  className = "w-[15px] h-[30px]",
}: {
  className?: string;
}) => {
  return (
    <svg
      className={className}
      width="15"
      height="30"
      viewBox="0 0 15 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="6.26001" width="1.5" height="30" fill="currentcolor"></rect>
      <path
        d="M14.0464 22.9768C10.1644 22.9768 7.02312 26.118 7.02312 30"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      ></path>
      <path
        d="M7.02322 30C7.02322 26.118 3.88198 22.9768 -4.06724e-05 22.9768"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      ></path>
    </svg>
  );
};
