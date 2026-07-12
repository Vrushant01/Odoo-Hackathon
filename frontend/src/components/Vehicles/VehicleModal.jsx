import React from "react";
import Modal from "../Modal/Modal";
import VehicleForm from "./VehicleForm";

export const VehicleModal = ({ isOpen, onClose, onSubmit, defaultValues, isEdit = false }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Vehicle Details" : "Register New Vehicle"}
      size="md"
    >
      <VehicleForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onCancel={onClose}
        isEdit={isEdit}
      />
    </Modal>
  );
};

export default VehicleModal;
