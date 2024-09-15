// code a page that shows the QR code for the user to scan and be redirect to the register page
import { QRCodeSVG } from "qrcode.react";
const QRCodePage = () => {
  const localUrl = process.env.NEXT_PUBLIC_LOCAL_URL ?? "";

  return (
    <div className="flex items-center flex-col justify-center h-screen">
      <h1>Escaneie o QR Code para se cadastrar</h1>
      <QRCodeSVG value={localUrl} />
    </div>
  );
};

export default QRCodePage;
