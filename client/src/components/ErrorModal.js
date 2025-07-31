import React from "react";
import { Modal, Button } from "react-bootstrap";

const ErrorModal = ({ show, handleClose, error }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ошибка</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <p>Неизвестная ошибка</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
