const HOME_CONTENT_CONFIG_KEY = "cz-admin:content:home"; //Ugar-biolian

export interface HomeContentConfig { //Ugar-biolian
  heroTitle: string; //Ugar-biolian
  heroSubtitle: string; //Ugar-biolian
  joinLink: string; //Ugar-biolian
  showProject: boolean; //Ugar-biolian
  showMember: boolean; //Ugar-biolian
  showLanqiao: boolean; //Ugar-biolian
} //Ugar-biolian

export const defaultHomeContentConfig: HomeContentConfig = { //Ugar-biolian
  heroTitle: "创智工作室", //Ugar-biolian
  heroSubtitle: "探索技术的无限可能", //Ugar-biolian
  joinLink: "https://czstudio.tech/join", //Ugar-biolian
  showProject: true, //Ugar-biolian
  showMember: true, //Ugar-biolian
  showLanqiao: true, //Ugar-biolian
}; //Ugar-biolian

export function getHomeContentConfig(): HomeContentConfig { //Ugar-biolian
  const raw = window.localStorage.getItem(HOME_CONTENT_CONFIG_KEY); //Ugar-biolian
  if (!raw) return { ...defaultHomeContentConfig }; //Ugar-biolian
  try { //Ugar-biolian
    return { ...defaultHomeContentConfig, ...JSON.parse(raw) }; //Ugar-biolian
  } catch { //Ugar-biolian
    return { ...defaultHomeContentConfig }; //Ugar-biolian
  } //Ugar-biolian
} //Ugar-biolian

export function saveHomeContentConfig(config: HomeContentConfig) { //Ugar-biolian
  window.localStorage.setItem(HOME_CONTENT_CONFIG_KEY, JSON.stringify(config)); //Ugar-biolian
  return config; //Ugar-biolian
} //Ugar-biolian
