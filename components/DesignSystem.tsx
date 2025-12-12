import React from 'react';
import { Loader2 } from 'lucide-react';

// Utility for joining classes conditionally
const cx = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

/**
 * ACCESSIBILITY: SKIP LINK
 */
export const SkipLink = () => (
  <a 
    href="#main-content" 
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-red-600 focus:p-4 focus:rounded-lg focus:shadow-xl focus:border-2 focus:border-red-600 font-bold"
  >
    Saltar al contenido principal
  </a>
);

/**
 * BUTTON COMPONENT
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, variant = 'primary', size = 'md', isLoading, fullWidth, className, disabled, leftIcon, rightIcon, ...props 
}, ref) => {
  
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-red-900/20 focus:ring-red-200",
    secondary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 focus:ring-indigo-200",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-green-900/20 focus:ring-green-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 focus:ring-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    outline: "bg-transparent border-2 border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-100 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white",
    glass: "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  return (
    <button 
      ref={ref}
      disabled={disabled || isLoading}
      className={cx(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin mr-2" size={size === 'sm' ? 14 : 18} />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});

/**
 * CARD COMPONENT
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className, hoverEffect, padding = 'md', glass, ...props }, ref) => {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-8"
  };

  return (
    <div 
      ref={ref}
      className={cx(
        "rounded-2xl border transition-all duration-300",
        glass ? "bg-white/80 backdrop-blur-md border-white/50 dark:bg-slate-900/80 dark:border-slate-700" : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-sm",
        hoverEffect ? "hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700" : "",
        paddings[padding],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

/**
 * BADGE COMPONENT
 */
interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge = ({ children, variant = 'default', size = 'md', className, icon }: BadgeProps) => {
  const styles = {
    default: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };
  
  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
  };

  return (
    <span className={cx("inline-flex items-center font-bold uppercase tracking-wide rounded-full", styles[variant], sizes[size], className)}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

/**
 * INPUT COMPONENT
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  value?: string | number | readonly string[];
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  type?: string;
  maxLength?: number;
  autoFocus?: boolean;
}

export const Input = ({ label, error, fullWidth, className, ...props }: InputProps) => (
  <div className={cx("flex flex-col gap-1", fullWidth ? "w-full" : "", className)}>
    {label && <label className="text-sm font-bold text-gray-600 dark:text-gray-300 ml-1">{label}</label>}
    <input 
      className={cx(
        "p-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl transition-colors font-medium focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900",
        error ? "border-red-500 focus:border-red-500" : "focus:border-red-500",
        props.disabled ? "bg-gray-100 dark:bg-slate-800 cursor-not-allowed opacity-70" : "bg-white dark:bg-slate-900 dark:text-white"
      )}
      {...props}
    />
    {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}
  </div>
);

/**
 * SELECT COMPONENT
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string, label: string }[];
  className?: string;
  value?: string | number | readonly string[];
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export const Select = ({ label, options, className, ...props }: SelectProps) => (
  <div className={cx("flex flex-col gap-1 w-full", className)}>
    {label && <label className="text-sm font-bold text-gray-600 dark:text-gray-300 ml-1">{label}</label>}
    <div className="relative">
      <select 
        className="w-full p-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900 appearance-none bg-white dark:bg-slate-900 dark:text-white"
        {...props}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  </div>
);
