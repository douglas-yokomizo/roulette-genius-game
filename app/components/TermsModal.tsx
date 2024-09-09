export const PrivacyTermsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-8 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Termos de Privacidade C&A
        </h2>
        <div className="mb-4 text-justify space-y-4">
          <p>
            TERMO DE AUTORIZAÇÃO PARA USO DE DIREITOS CONEXOS PATRIMONIAIS E DE
            IMAGEM
          </p>
          <p>
            Por meio da presente, o TITULAR concorda, de maneira livre,
            informada e inequívoca, com o tratamento de seus dados pessoais para
            as finalidades aqui delineadas nos termos da Lei nº 13.709/2018 –
            Lei Geral de Proteção de Dados Pessoais (“LGPD”), a C&A MODAS S.A.
            (CNPJ/MF nº 45.242.914/0001-05) e as empresas do mesmo grupo
            econômico (“C&A”), em conjunto ou isoladamente, a: filmar e/ou
            gravar todos os depoimentos por mim prestados; utilizar e divulgar,
            com fins lucrativos ou não, total ou parcialmente, meus direitos
            conexos patrimoniais e de personalidade relativos à imagem e voz –
            decorrentes, inclusive, da Constituição Federal, Código Civil (Lei
            nº 10.406/02), Lei Geral de Proteção de Dados (Lei nº 13.709/18)1,
            bem como de legislação correlata e aplicável –, incluindo mas não se
            limitando em locais de divulgação presentes no evento Rock in Rio
            2024 e canais de comunicação da C&A relacionados ao evento, tais
            como rádio, televisão, cinema, jornal, revista, cartazes, folhetos,
            internet, redes sociais (como Facebook, LinkedIn, Instagram,
            Snapchat, YouTube, Twitter etc.), site/e-Commerce da C&A, televisão
            e vitrines das lojas e stands da C&A, ou qualquer outro sistema de
            comunicação ou local de veiculação, sem qualquer restrição de
            números de exibições, edições, reedições e veiculações; utilizar e
            divulgar, com fins lucrativos ou não, meu nome civil e/ou pseudônimo
            em todas e quaisquer modalidades de utilização existentes
            atualmente, bem como que vierem a ser criadas, tais como rádio,
            televisão, internet, redes sociais, jornais de circulação pública,
            folhetos em geral (cartazes, encartes, mala direta, catálogo etc.),
            informativos externos e internos e publicidade em geral; manter no
            histórico de seus canais de comunicação, resguardando a
            impossibilidade de republicação após o período autorizado e com o
            intuito comercial.
          </p>
          <p>
            Neste sentido, este consentimento é concedido à C&A pelo período de
            duração do evento Rock in Rio 2024, ficando reservado à C&A o
            direito de utilizar, total ou parcialmente, os meus direitos conexos
            patrimoniais e de personalidade relativos ao uso dos meus dados
            pessoais, nome, voz e às imagens fixadas e reproduzidas nas
            fotografias e filmes objeto do presente instrumento. O TITULAR
            poderá revogar seu consentimento, a qualquer tempo, conforme o
            artigo 8°, § 5°, da LGPD.
          </p>
          <p>
            Fica assegurado à C&A, também, o direito de compartilhar meus dados,
            voz e imagens decorrentes deste termo com terceiros e parceiros
            (agentes de tratamento de dados) comerciais da C&A, com o exclusivo
            fim de utilização, veiculação e exploração desde que sejam
            respeitados os princípios da boa-fé, finalidade, adequação,
            necessidade, livre acesso, qualidade dos dados, transparência,
            segurança, prevenção, não discriminação e responsabilização e
            prestação de contas, nos termos e limites acima descritos, por
            responsabilidade e conta e ordem da C&A. A C&A responsabilizar-se-á
            pela manutenção de medidas de segurança, técnicas e administrativas
            aptas a proteger os dados pessoais de acessos não autorizados e de
            situações acidentais ou ilícitas de destruição, perda, alteração,
            comunicação ou qualquer forma de tratamento inadequado ou ilícito.
          </p>
          <p>
            Declaro que a presente autorização é concedida a título gratuito,
            não gerando qualquer direito de recebimento de quaisquer valores,
            seja a que título for.
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
