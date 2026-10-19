// Public business details provided by the founder.
export const company = {
  name: "ATL Soluções em Tecnologia",
  shortName: "ATL",
  tagline: "Soluções em Tecnologia",
  founder: "Marlom C. Lucas",
  role: "Engenheiro de Software",
  specialization: "Consultoria e Desenvolvimento de Sistemas",
  email: "marlomlucas@hotmail.com",
  phoneDisplay: "(51) 99470-9009",
  whatsappNumber: "5551994709009",
  linkedIn: "https://www.linkedin.com/in/marlom-c-lucas/",
  github: "https://github.com/marlomlucas",
} as const;

export const whatsappUrl =
  `https://wa.me/${company.whatsappNumber}?text=` +
  encodeURIComponent(
    "Olá, Marlom! Conheci a ATL e gostaria de conversar sobre um projeto.",
  );
