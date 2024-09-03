"use client";
import { useState } from "react";
import { supabase } from "../utils/supabase/client";
import Image from "next/image";
import { images } from "@/public/images";
import CustomCheckbox from "../components/CheckBox";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    whatsapp: "",
    email: "",
    privacyTerms: false,
    imageTerms: false,
    bigScreenAgreement: false,
    comunicationAgreement: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, cpf, whatsapp, email, privacyTerms, imageTerms } = formData;

    if (!privacyTerms || !imageTerms) {
      alert(
        "Você deve concordar com os termos de privacidade e uso de imagem."
      );
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, cpf, whatsapp, email }]);

    if (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Houve um erro ao cadastrar. Tente novamente.");
    } else {
      alert("Usuário cadastrado com sucesso!");
      setFormData({
        name: "",
        cpf: "",
        whatsapp: "",
        email: "",
        privacyTerms: false,
        imageTerms: false,
        bigScreenAgreement: false,
        comunicationAgreement: false,
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-azul">
      <Image src={images.caLogoBgAzul} alt="C&A Logo" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-12 p-10 h-4/5 mt-20 font-sharp font-bold text-4xl w-11/12"
      >
        <label>
          <p className="pl-8">nome completo*</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-4 w-full rounded-full bg-cinza"
          />
        </label>

        <label>
          <p className="pl-8">cpf*</p>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
            className="border p-4 w-full rounded-full bg-cinza"
          />
        </label>

        <label>
          <p className="pl-8">whatsapp*</p>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            required
            className="border p-4 w-full rounded-full bg-cinza"
          />
        </label>

        <label>
          <p className="pl-8">email*</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-4 w-full rounded-full bg-cinza"
          />
        </label>

        <div className="text-3xl flex flex-col gap-4 tracking-wide">
          <CustomCheckbox
            label="estou de acordo com os termos de privacidade C&A*"
            onChange={(checked) => {
              setFormData({ ...formData, privacyTerms: checked });
            }}
            checked={formData.privacyTerms}
            color="#4200F8"
          />
          <CustomCheckbox
            label="estou de acordo com o termo de uso de imagem*"
            onChange={(checked) => {
              setFormData({ ...formData, imageTerms: checked });
            }}
            checked={formData.imageTerms}
            color="#4200F8"
          />
          <CustomCheckbox
            label="concordo em aparecer no telão do stand"
            onChange={(checked) => {
              setFormData({ ...formData, bigScreenAgreement: checked });
            }}
            checked={formData.bigScreenAgreement}
            color="#4200F8"
          />
          <CustomCheckbox
            label="concordo em receber comunicações da C&A"
            onChange={(checked) => {
              setFormData({ ...formData, comunicationAgreement: checked });
            }}
            checked={formData.comunicationAgreement}
            color="#4200F8"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
