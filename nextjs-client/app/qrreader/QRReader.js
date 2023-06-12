'use client'

import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import Modal from "react-modal";
import ModalWithdraw from "./ModalWithdraw";

export default function QRReader() {
  const [data, setData] = useState("No result");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const CustomStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: "9",
    },
    content: {
      width: "95%",
      border: `0 solid black`,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      zIndex: "99999",
    },
  };

  return (
    <div>
      <div>
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.text);
              openModal();
            }

            if (!!error) {
              console.info(error);
            }
          }}
          constraints={{ facingMode: "environment" }}
          style={{ width: "40%", height: "40%" }}
        />
        <p>{data}</p>
        <Modal
          isOpen={modalIsOpen}
          //isOpen={true}
          onRequestClose={closeModal}
          appElement={document.querySelector("#__next")}
          style={CustomStyles}
        >
          <h2>QR Code Result</h2>
          <ModalWithdraw tofintechno={data}></ModalWithdraw>
          <button onClick={closeModal}>창닫기</button>
        </Modal>
      </div>
    </div>
  );
}



