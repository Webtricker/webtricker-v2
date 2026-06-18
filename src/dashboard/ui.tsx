import React from "react";

const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
      className
    )}
  >
    {children}
  </div>
);

export const CardHeader = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn("flex flex-col space-y-1.5 p-4 pb-2", className)}>
    {children}
  </div>
);

export const CardContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={cn("p-4 pt-2", className)}>{children}</div>;

type ButtonProps = {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
};

export const Button = ({
  asChild,
  children,
  className,
  variant = "primary",
}: ButtonProps) => {
  const baseClass = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition",
    variant === "primary"
      ? "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      : "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900",
    className
  );

  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, {
      className: cn(baseClass, children.props.className),
    });
  }

  return <button className={baseClass}>{children}</button>;
};

export const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800",
      className
    )}
  />
);

export const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
      className
    )}
  >
    {children}
  </span>
);
