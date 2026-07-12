import React from "react";
import Modal from "../Modal/Modal";
import DriverForm from "./DriverForm";

export const DriverModal = ({ isOpen, onClose, onSubmit, defaultValues, isEdit = false }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Driver Profile" : "Register New Driver"}
      size="md"
    >
      <DriverForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onCancel={onClose}
        isEdit={isEdit}
      />
    </Modal>
  );
};

export default DriverModal;
