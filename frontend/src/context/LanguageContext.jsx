import { createContext, useContext, useEffect, useState } from "react";

export const LanguageContext = createContext();

// Define translations
const translations = {
  en: {
    // Navigation
    home: "Home",
    book: "Book",
    doctors: "Doctors",
    about: "About",
    contact: "Contact",
    login: "Login",
    register: "Register",
    dashboard: "Dashboard",
    myAppointments: "My Appointments",
    notifications: "Notifications",
    profile: "Profile",
    settings: "Settings",
    
    // Dashboard
    welcome: "Welcome",
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    totalAppointments: "Total Appointments",
    todaysAppointments: "Today's Appointments",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    upcomingAppointments: "Upcoming Appointments",
    viewAll: "View All",
    noUpcomingAppointments: "No upcoming appointments",
    
    // Common
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    search: "Search",
    filter: "Filter",
    export: "Export",
    add: "Add",
    edit: "Edit",
    view: "View",
    delete: "Delete"
  },
  es: {
    // Navigation
    home: "Inicio",
    book: "Reservar",
    doctors: "Doctores",
    about: "Acerca de",
    contact: "Contacto",
    login: "Iniciar sesión",
    register: "Registrarse",
    dashboard: "Panel",
    myAppointments: "Mis Citas",
    notifications: "Notificaciones",
    profile: "Perfil",
    settings: "Configuración",
    
    // Dashboard
    welcome: "Bienvenido",
    goodMorning: "Buenos días",
    goodAfternoon: "Buenas tardes",
    goodEvening: "Buenas noches",
    totalAppointments: "Citas Totales",
    todaysAppointments: "Citas de Hoy",
    confirmed: "Confirmadas",
    cancelled: "Canceladas",
    upcomingAppointments: "Próximas Citas",
    viewAll: "Ver Todas",
    noUpcomingAppointments: "No hay citas próximas",
    
    // Common
    loading: "Cargando...",
    save: "Guardar",
    cancel: "Cancelar",
    close: "Cerrar",
    search: "Buscar",
    filter: "Filtrar",
    export: "Exportar",
    add: "Agregar",
    edit: "Editar",
    view: "Ver",
    delete: "Eliminar"
  },
  fr: {
    // Navigation
    home: "Accueil",
    book: "Réserver",
    doctors: "Médecins",
    about: "À propos",
    contact: "Contact",
    login: "Connexion",
    register: "S'inscrire",
    dashboard: "Tableau de bord",
    myAppointments: "Mes Rendez-vous",
    notifications: "Notifications",
    profile: "Profil",
    settings: "Paramètres",
    
    // Dashboard
    welcome: "Bienvenue",
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    totalAppointments: "Rendez-vous Totaux",
    todaysAppointments: "Rendez-vous d'Aujourd'hui",
    confirmed: "Confirmés",
    cancelled: "Annulés",
    upcomingAppointments: "Rendez-vous à Venir",
    viewAll: "Tout Voir",
    noUpcomingAppointments: "Aucun rendez-vous à venir",
    
    // Common
    loading: "Chargement...",
    save: "Enregistrer",
    cancel: "Annuler",
    close: "Fermer",
    search: "Rechercher",
    filter: "Filtrer",
    export: "Exporter",
    add: "Ajouter",
    edit: "Modifier",
    view: "Voir",
    delete: "Supprimer"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, then default to English
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || "en";
  });

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem("language", language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};