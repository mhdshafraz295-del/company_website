import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const PublicDataContext = createContext(null);

export const PublicDataProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [founder, setFounder] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);

  const [loading, setLoading] = useState({
    settings: true,
    services: true,
    projects: true,
    team: true,
    founder: true,
    testimonials: true,
    faqs: true,
    caseStudies: true,
  });

  const [errors, setErrors] = useState({});

  // 1. Fetch Website Settings & Social Links
  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get('/settings');
      if (res.data?.success) {
        setSettings(res.data.data.setting || null);
        setSocialLinks(res.data.data.socialLinks || []);
      }
    } catch (err) {
      console.warn('Unable to load website settings:', err.message);
      setErrors((prev) => ({ ...prev, settings: true }));
    } finally {
      setLoading((prev) => ({ ...prev, settings: false }));
    }
  }, []);

  // 2. Fetch Active Services
  const fetchServices = useCallback(async () => {
    try {
      const res = await api.get('/services');
      if (res.data?.success) {
        setServices(res.data.data || []);
      }
    } catch (err) {
      console.warn('Unable to load services:', err.message);
      setErrors((prev) => ({ ...prev, services: true }));
    } finally {
      setLoading((prev) => ({ ...prev, services: false }));
    }
  }, []);

  // 3. Fetch Published Projects
  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/projects?limit=50');
      if (res.data?.success) {
        setProjects(res.data.data || []);
      }
    } catch (err) {
      console.warn('Unable to load projects:', err.message);
      setErrors((prev) => ({ ...prev, projects: true }));
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  }, []);

  // 4. Fetch Active Team Members
  const fetchTeam = useCallback(async () => {
    try {
      const res = await api.get('/team');
      if (res.data?.success) {
        setTeam(res.data.data || []);
      }
    } catch (err) {
      console.warn('Unable to load team members:', err.message);
      setErrors((prev) => ({ ...prev, team: true }));
    } finally {
      setLoading((prev) => ({ ...prev, team: false }));
    }
  }, []);

  // 5. Fetch Founder Profile
  const fetchFounder = useCallback(async () => {
    try {
      const res = await api.get('/founder');
      if (res.data?.success) {
        setFounder(res.data.data || null);
      }
    } catch (err) {
      console.warn('Unable to load founder profile:', err.message);
      setErrors((prev) => ({ ...prev, founder: true }));
    } finally {
      setLoading((prev) => ({ ...prev, founder: false }));
    }
  }, []);

  // 6. Fetch Testimonials
  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await api.get('/testimonials');
      if (res.data?.success) {
        setTestimonials(res.data.data || []);
      }
    } catch (err) {
      console.warn('Unable to load testimonials:', err.message);
      setErrors((prev) => ({ ...prev, testimonials: true }));
    } finally {
      setLoading((prev) => ({ ...prev, testimonials: false }));
    }
  }, []);

  // 7. Fetch FAQs
  const fetchFaqs = useCallback(async () => {
    try {
      const res = await api.get('/faqs');
      if (res.data?.success) {
        setFaqs(res.data.data || []);
      }
    } catch (err) {
      console.warn('Unable to load FAQs:', err.message);
      setErrors((prev) => ({ ...prev, faqs: true }));
    } finally {
      setLoading((prev) => ({ ...prev, faqs: false }));
    }
  }, []);

  // 8. Fetch Case Studies
  const fetchCaseStudies = useCallback(async () => {
    try {
      const res = await api.get('/case-studies');
      if (res.data?.success) {
        setCaseStudies(res.data.data || []);
      }
    } catch (err) {
      console.warn('Unable to load case studies:', err.message);
      setErrors((prev) => ({ ...prev, caseStudies: true }));
    } finally {
      setLoading((prev) => ({ ...prev, caseStudies: false }));
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchServices();
    fetchProjects();
    fetchTeam();
    fetchFounder();
    fetchTestimonials();
    fetchFaqs();
    fetchCaseStudies();
  }, [
    fetchSettings,
    fetchServices,
    fetchProjects,
    fetchTeam,
    fetchFounder,
    fetchTestimonials,
    fetchFaqs,
    fetchCaseStudies,
  ]);

  // Master refetch function for instant public site updates after Admin CMS edits
  const refetchAll = useCallback(() => {
    fetchSettings();
    fetchServices();
    fetchProjects();
    fetchTeam();
    fetchFounder();
    fetchTestimonials();
    fetchFaqs();
    fetchCaseStudies();
  }, [
    fetchSettings,
    fetchServices,
    fetchProjects,
    fetchTeam,
    fetchFounder,
    fetchTestimonials,
    fetchFaqs,
    fetchCaseStudies,
  ]);

  const value = {
    settings,
    socialLinks,
    services,
    projects,
    team,
    founder,
    testimonials,
    faqs,
    caseStudies,
    loading,
    errors,
    refetchAll,
    refetchServices: fetchServices,
    refetchProjects: fetchProjects,
    refetchTeam: fetchTeam,
    refetchFounder: fetchFounder,
    refetchTestimonials: fetchTestimonials,
    refetchFaqs: fetchFaqs,
    refetchCaseStudies: fetchCaseStudies,
    refetchSettings: fetchSettings,
  };

  return (
    <PublicDataContext.Provider value={value}>
      {children}
    </PublicDataContext.Provider>
  );
};
