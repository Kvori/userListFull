import { Button, Spinner } from 'react-bootstrap';

function CustomButton({ children, variant, isLoading, onClick, disabled, className, icon, ...props }) {
  return (
    <Button
      className={`d-flex justify-content-center align-items-center gap-2 ${className || ''}`}
      variant={variant}
      onClick={onClick}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Spinner animation="border" size="sm" />}
      {!isLoading && icon && <span className="d-flex align-items-center">{icon}</span>}
      {children}
    </Button>
  );
}

export default CustomButton;
