interface ButtonComponent {
  bgcolor?: string;
  textcolor?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
