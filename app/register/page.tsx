"use client";
import { supabase } from "../utils/supabase/client";
import Image from "next/image";
import { images } from "@/public/images";
import CustomCheckbox from "../components/CheckBox";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumber } from "libphonenumber-js";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const initialValues = {
    name: "",
    cpf: "",
    whatsapp: "",
    email: "",
    privacyTerms: false,
    imageTerms: false,
    bigScreenAgreement: false,
    comunicationAgreement: false,
  };
  const router = useRouter();

  const validateWhatsApp = (value: any, countryCode: any) => {
    if (!value) return false;
    try {
      const phoneNumber = parsePhoneNumber(value, countryCode);
      return phoneNumber.isValid();
    } catch (error) {
      return false;
    }
  };

  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    const calculateDigit = (base: string, factor: number) => {
      let total = 0;
      for (let i = 0; i < base.length; i++) {
        total += parseInt(base[i]) * factor--;
      }
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const base = cpf.substring(0, 9);
    const digit1 = calculateDigit(base, 10);
    const digit2 = calculateDigit(base + digit1, 11);

    return cpf.endsWith(`${digit1}${digit2}`);
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(
        /^[a-zA-Z]+ [a-zA-Z]+$/,
        "Nome completo deve conter pelo menos dois nomes"
      )
      .required("Nome completo é obrigatório"),
    cpf: Yup.string()
      .matches(
        /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        "CPF deve seguir o formato XXX.XXX.XXX-XX"
      )
      .required("CPF é obrigatório")
      .test("is-valid-cpf", "CPF inválido", (value) =>
        validateCPF(value || "")
      ),
    whatsapp: Yup.string()
      .required("WhatsApp é obrigatório")
      .test("is-valid-whatsapp", "Número de WhatsApp inválido", (value) =>
        validateWhatsApp(value, "BR")
      ),
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    privacyTerms: Yup.boolean().oneOf(
      [true],
      "Você deve concordar com os termos de privacidade"
    ),
    imageTerms: Yup.boolean().oneOf(
      [true],
      "Você deve concordar com o termo de uso de imagem"
    ),
  });

  const capitalizeName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    const {
      name,
      cpf,
      whatsapp,
      email,
      privacyTerms,
      imageTerms,
      bigScreenAgreement,
      comunicationAgreement,
    } = values;

    const formattedName = capitalizeName(name);

    const { data: cpfData, error: cpfError } = await supabase
      .from("users")
      .select("cpf")
      .eq("cpf", cpf)
      .single();

    if (cpfData) {
      toast("CPF já cadastrado. Por favor, verifique e tente novamente.", {
        type: "error",
      });
      setSubmitting(false);
      return;
    }

    const { data: emailData, error: emailError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (emailData) {
      toast("Email já cadastrado. Por favor, verifique e tente novamente.", {
        type: "error",
      });
      setSubmitting(false);
      return;
    }

    const { data: whatsappData, error: whatsappError } = await supabase
      .from("users")
      .select("whatsapp")
      .eq("whatsapp", whatsapp)
      .single();

    if (whatsappData) {
      toast("WhatsApp já cadastrado. Por favor, verifique e tente novamente.", {
        type: "error",
      });
      setSubmitting(false);
      return;
    }

    const { data, error } = await supabase.from("users").insert([
      {
        name: formattedName,
        cpf,
        whatsapp,
        email,
        privacyTerms,
        imageTerms,
        bigScreenAgreement,
        comunicationAgreement,
      },
    ]);

    if (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast("Houve um erro ao cadastrar. Tente novamente.", {
        type: "error",
      });
    } else {
      toast("Usuário cadastrado com sucesso!", {
        type: "success",
      });
      resetForm();
      router.push("/register/success");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col justify-center items-center relative h-screen text-azul">
      <Image src={images.caLogoBgAzul} alt="C&A Logo" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form className="flex flex-col gap-12 p-10 h-4/5 mt-20 font-sharp font-bold text-4xl w-11/12">
            <label>
              <p className="pl-8">nome completo*</p>
              <Field
                type="text"
                name="name"
                autoComplete="off"
                className={`border p-4 w-full rounded-full bg-cinza pl-10 text-black text-3xl capitalize ${
                  errors.name && touched.name ? "border-red-500 border-2" : ""
                }`}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 pl-8 text-2xl"
              />
            </label>

            <label>
              <p className="pl-8">cpf*</p>
              <Field name="cpf">
                {({ field }: any) => (
                  <InputMask
                    {...field}
                    mask="999.999.999-99"
                    autoComplete="off"
                    className={`border p-4 w-full rounded-full bg-cinza pl-10 text-black text-3xl ${
                      errors.cpf && touched.cpf ? "border-red-500 border-2" : ""
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="cpf"
                component="div"
                className="text-red-500 pl-8 text-2xl"
              />
            </label>

            <label>
              <p className="pl-8">whatsapp*</p>
              <Field name="whatsapp">
                {({ field, form }: any) => (
                  <PhoneInput
                    {...field}
                    country={"br"}
                    containerClass={`border p-4 w-full rounded-full bg-cinza pl-2 text-black text-3xl ${
                      errors.whatsapp && touched.whatsapp
                        ? "border-red-500 border-2"
                        : ""
                    }`}
                    masks={{ br: "(..) .....-...." }}
                    buttonStyle={{
                      backgroundColor: "#E6E6E6",
                      border: "none",
                      borderRadius: "100px 0 0 100px",
                    }}
                    placeholder=""
                    inputStyle={{
                      backgroundColor: "#E6E6E6",
                      border: "none",
                      fontSize: "1.875rem",
                      lineHeight: "2.25rem",
                      fontFamily: "SharpSans",
                      padding: "1rem 1rem 1rem 3rem",
                      width: "calc(100% - 1.5rem)",
                    }}
                    onChange={(value, country, e, formattedValue) =>
                      setFieldValue("whatsapp", formattedValue)
                    }
                    onBlur={() => {
                      field.onBlur(field.name);
                      form.setFieldTouched("whatsapp", true);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name="whatsapp"
                component="div"
                className="text-red-500 pl-8 text-2xl"
              />
            </label>

            <label>
              <p className="pl-8">email*</p>
              <Field
                type="email"
                name="email"
                autoComplete="off"
                className={`border p-4 w-full rounded-full bg-cinza pl-10 text-black text-3xl ${
                  errors.email && touched.email ? "border-red-500 border-2" : ""
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 pl-8 text-2xl"
              />
            </label>

            <div className="text-3xl flex flex-col gap-4 tracking-wide">
              <CustomCheckbox
                label="estou de acordo com os termos de privacidade C&A*"
                onChange={(checked) => {
                  setFieldValue("privacyTerms", checked);
                }}
                checked={values.privacyTerms}
                color="#4200F8"
              />
              <ErrorMessage
                name="privacyTerms"
                component="div"
                className="text-red-500 pl-8 text-2xl"
              />
              <CustomCheckbox
                label="estou de acordo com o termo de uso de imagem*"
                onChange={(checked) => {
                  setFieldValue("imageTerms", checked);
                }}
                checked={values.imageTerms}
                color="#4200F8"
              />
              <ErrorMessage
                name="imageTerms"
                component="div"
                className="text-red-500 pl-8 text-2xl"
              />
              <CustomCheckbox
                label="concordo em aparecer no telão do stand"
                onChange={(checked) => {
                  setFieldValue("bigScreenAgreement", checked);
                }}
                checked={values.bigScreenAgreement}
                color="#4200F8"
              />
              <CustomCheckbox
                label="concordo em receber comunicações da C&A"
                onChange={(checked) => {
                  setFieldValue("comunicationAgreement", checked);
                }}
                checked={values.comunicationAgreement}
                color="#4200F8"
              />
              <p className="ml-14 mt-6">*itens obrigatórios</p>
            </div>
            <button
              type="submit"
              className="bg-azul text-white py-6 mt-10 w-full rounded-full"
              disabled={isSubmitting}
            >
              Registrar
            </button>
          </Form>
        )}
      </Formik>
      <Image
        src={images.lookOficial}
        alt="Look oficial do RIR"
        width={500}
        className="absolute bottom-20"
      />
    </div>
  );
};

export default RegisterPage;
