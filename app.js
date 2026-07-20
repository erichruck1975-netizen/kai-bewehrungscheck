const STORAGE_KEY = "kai-bewehrungscheck-protocols-v01";
const SETTINGS_KEY = "kai-bewehrungscheck-settings-v01";
const DB_NAME = "kai-bewehrungscheck-db";
const DB_VERSION = 4;
const PDFJS_VERSION = "3.11.174";
const APP_VERSION = "v136";
const APP_CACHE = `kai-bewehrungscheck-${APP_VERSION}`;
const PDFJS_URL = `vendor/pdfjs/pdf.min.js?${APP_VERSION}`;
const PDFJS_WORKER_URL = `vendor/pdfjs/pdf.worker.min.js?${APP_VERSION}`;
const STABLE_TAG = "v52-stable-before-v53";
const STATUSES = ["fertig / OK", "teilweise / Auflage", "nicht OK / Mangel", "Dokumentation", "nicht relevant"];
const FOLLOWUP_STATUSES = ["erledigt", "teilweise erledigt", "weiterhin offen", "nicht prüfbar", "neu hinzugekommen"];
const OVERLAP_PLAN_MODE = "plan_value";
const OVERLAP_EC2_MODE = "ec2_na";
const EC2_NA_CONFIG = {
  // EC2/NA configuration block. Values are kept central so they can be reviewed and adapted if project-specific or NA-specific requirements change.
  concrete: {
    "C20/25": { fctk005: 1.5 },
    "C25/30": { fctk005: 1.8 },
    "C30/37": { fctk005: 2.0 },
    "C35/45": { fctk005: 2.2 },
    "C40/50": { fctk005: 2.5 },
    "C45/55": { fctk005: 2.7 },
    "C50/60": { fctk005: 2.9 }
  },
  gammaC: 1.5,
  alphaCt: 1.0,
  fyk: 500,
  gammaS: 1.15,
  eta1: { good: 1.0, moderate: 0.7, unknown: 0.7 },
  alpha6: { le25: 1.0, p33: 1.15, p50: 1.4, gt50: 1.5, unknown: 1.5 }
};
const PROTOCOL_KIND_REBAR = "rebar-inspection";
const PROTOCOL_KIND_SITE_CONTROL = "site-control";
const PROTOCOL_KIND_DAILY_REPORT = "daily-report";
const PROTOCOL_KIND_PROJECT_PLANS = "project-plans";

const SITE_CONTROL_TYPES = ["Mangel", "Aufgabe", "Hinweis", "Foto-Doku", "Klärungspunkt"];
const SITE_CONTROL_TRADES = ["Rohbau", "Bewehrung", "Schalung", "Betonage", "TGA", "Elektro", "Abdichtung", "Ausbau", "Planung", "Bauleitung", "Sonstige"];
const SITE_CONTROL_PRIORITIES = ["normal", "hoch", "kritisch"];
const SITE_CONTROL_STATUSES = ["offen", "in Bearbeitung", "erledigt", "zur Klärung", "nicht prüfbar"];
const SITE_CONTROL_REASONS = ["Regelbegehung", "Mangelkontrolle", "Fotodokumentation", "Abstimmung", "Nachbegehung", "Sonstige"];
const POSTAL_CITY_LOOKUP = {
  "80999": "München",
  "86150": "Augsburg",
  "91550": "Dinkelsbühl",
  "91744": "Weiltingen"
};

const CHECK_ITEMS = [
  "Schalung / Sauberkeit",
  "untere Bewehrungslage",
  "obere Bewehrungslage",
  "Randbewehrung",
  "Zulagen",
  "Durchstanzbewehrung/Schubbewehrung",
  "Anschlussbewehrung",
  "Bügel / Bügelabstände",
  "Abstandhalter / Unterstützungen",
  "Betondeckung augenscheinlich",
  "Übergreifungslängen augenscheinlich",
  "Aussparungen / Durchbrüche",
  "Einbauteile",
  "Fundamenterder / Erdung",
  "Fugen / Fugenbleche",
  "besondere Feststellungen"
];

const CHECK_SCOPE_TEMPLATES = {
  bodenplatte: [
    "Schalung / Sauberkeit",
    "untere Bewehrungslage",
    "obere Bewehrungslage",
    "Randbewehrung",
    "Zulagen",
    "Durchstanzbewehrung/Schubbewehrung",
    "Anschlussbewehrung",
    "Abstandhalter / Unterstützungen",
    "Betondeckung augenscheinlich",
    "Übergreifungslängen",
    "Aussparungen / Durchbrüche",
    "Einbauteile",
    "Fundamenterder / Erdung",
    "Fugen / Fugenbleche"
  ],
  decke: [
    "obere Bewehrungslage",
    "Randbewehrung",
    "Zulagen",
    "Durchstanzbewehrung/Schubbewehrung",
    "Anschlussbewehrung",
    "Abstandhalter / Unterstützungen",
    "Betondeckung augenscheinlich",
    "Übergreifungslängen",
    "Aussparungen / Durchbrüche",
    "Einbauteile",
    "besondere Feststellungen"
  ],
  filigrandecke: [
    "obere Bewehrungslage",
    "Randbewehrung",
    "Zulagen",
    "Durchstanzbewehrung/Schubbewehrung",
    "Anschlussbewehrung",
    "Abstandhalter / Unterstützungen",
    "Betondeckung augenscheinlich",
    "Übergreifungslängen",
    "Aussparungen / Durchbrüche",
    "Einbauteile",
    "besondere Feststellungen"
  ],
  wand: [
    "Anschlussbewehrung",
    "Randbewehrung",
    "Zulagen",
    "Aussparungen / Durchbrüche",
    "Einbauteile",
    "Betondeckung augenscheinlich",
    "Übergreifungslängen",
    "besondere Feststellungen"
  ],
  stuetze: [
    "Anschlussbewehrung",
    "Bügel / Bügelabstände",
    "Abstandhalter / Unterstützungen",
    "Betondeckung augenscheinlich",
    "Übergreifungslängen",
    "besondere Feststellungen"
  ],
  rampe: [
    "Schalung / Sauberkeit",
    "untere Bewehrungslage",
    "obere Bewehrungslage",
    "Randbewehrung",
    "Anschlussbewehrung",
    "Abstandhalter / Unterstützungen",
    "Betondeckung augenscheinlich",
    "Übergreifungslängen",
    "Fugen / Fugenbleche",
    "besondere Feststellungen"
  ]
};

const DEFAULT_MASTER_DATA = {
  ownPersons: [],
  companies: [],
  inspectors: [],
  components: ["Bodenplatte", "Fundament", "Wand", "Stütze", "Unterzug", "Decke", "Filigrandecke", "Decke UG/Unterzüge", "Aufzugsschacht", "Treppenhauskern", "Rampe", "Sonstige"],
  floors: ["UG", "EG", "1. OG", "2. OG", "DG", "Tiefgarage", "Untergeschoss", "Sonstige"],
  acceptanceTypes: ["Erstabnahme", "Nachkontrolle", "Teilabnahme", "Ergänzung"],
  areaAxes: ["Achse A/1", "Achse B/2", "Randbereich", "Mittelbereich", "Wandanschluss", "Deckenfeld", "Unterzug", "Stütze", "Sonstige"],
  signatureRoles: ["Abnehmender / Bewehrungskontrolle", "Verantwortlicher vor Ort", "Polier", "Bauleiter", "Eisenflechter", "Betonbauer", "Prüfingenieur", "Sonstige"],
  trades: SITE_CONTROL_TRADES,
  siteControlTypes: SITE_CONTROL_TYPES,
  siteControlReasons: SITE_CONTROL_REASONS,
  siteControlPriorities: SITE_CONTROL_PRIORITIES
};

const state = {
  projects: [],
  protocols: [],
  masterData: null,
  masterDataDirty: false,
  dataLoaded: false,
  masterDataSection: "",
  pendingMasterDataLeaveResolve: null,
  settings: {},
  currentProjectId: "",
  pendingAcceptanceProjectId: "",
  current: null,
  selectedPlanId: "",
  selectedPinId: "",
  lastPdfFileShareDebug: null,
  pinSearchQuery: "",
  reassignSampleId: "",
  checkScopeOnlyActive: false,
  openCheckId: "",
  openSampleId: "",
  signatureEditId: "",
  photoTarget: null,
  pinMode: false,
  placementModePinId: "",
  markTarget: null,
  mark: {
    sampleId: "",
    planId: "",
    pageNumber: 1,
    zoom: 1,
    panX: 0,
    panY: 0,
    active: false,
    renderToken: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    fitScale: 1,
    pointers: new Map(),
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
    moved: false,
    isPinching: false,
    pinchStartDistance: 0,
    pinchStartZoom: 1,
    pinchCenter: null,
    movePinId: ""
  },
  pdfDocs: new Map(),
  pdfPageCache: new Map(),
  planRender: {
    task: null,
    token: 0
  },
  viewHistory: [],
  protocolTabHistory: [],
  projectPlansReturn: null,
  db: null,
  objectUrls: new Map(),
  reportPlanImages: new Map(),
  reportView: {
    mode: "read",
    scale: 1,
    translateX: 0,
    translateY: 0,
    fitScale: 1,
    baseWidth: 0,
    baseHeight: 0,
    pointers: new Map(),
    startDistance: 0,
    startCenter: null,
    startScale: 1,
    startTranslateX: 0,
    startTranslateY: 0,
    startPointer: null
  },
  persistTimer: null,
  voice: {
    active: false,
    recognition: null,
    button: null,
    baseText: "",
    finalText: "",
    finalResults: {}
  },
  zoomPersistTimer: null,
  touch: {
    active: false,
    pointers: new Map(),
    startDistance: 0,
    startZoom: 1,
    startScrollLeft: 0,
    startScrollTop: 0,
    startPanX: 0,
    startPanY: 0,
    startX: 0,
    startY: 0,
    moved: false,
    pinTapCandidate: false,
    pinchActive: false,
    pinchStartDistance: 0,
    pinchStartZoom: 1
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function nowLocalInput() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function load({ persistRepairs = true } = {}) {
  state.dataLoaded = false;
  state.db = await openDatabase();
  state.projects = (await idbGetAll("projects")).map(normalizeProject);
  state.protocols = (await idbGetAll("protocols")).map(normalizeProtocol);
  state.masterData = normalizeMasterData(await idbGet("masterData", "app"));
  state.settings = await idbGet("settings", "app") || JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  let migrated = false;
  if (!state.protocols.length) {
    await migrateLocalStorageData();
    migrated = true;
  }
  const structureChanged = ensureProjectStructure();
  state.dataLoaded = true;
  syncSettingsInputs();
  renderDatalists();
  if (persistRepairs && (migrated || structureChanged)) await persist();
}

function syncSettingsInputs() {
  const defaultInspector = $("#defaultInspector");
  if (defaultInspector) defaultInspector.value = state.settings.defaultInspector || "";
  const defaultCompany = $("#defaultCompany");
  if (defaultCompany) defaultCompany.value = state.settings.defaultCompany || "";
  if ($("#dropboxBaseFolder")) $("#dropboxBaseFolder").value = state.settings.dropboxBaseFolder || "";
  if ($("#dropboxPlanFolder")) $("#dropboxPlanFolder").value = state.settings.dropboxPlanFolder || "Pläne";
  if ($("#dropboxPhotoFolder")) $("#dropboxPhotoFolder").value = state.settings.dropboxPhotoFolder || "Fotos";
  if ($("#dropboxReportFolder")) $("#dropboxReportFolder").value = state.settings.dropboxReportFolder || "Berichte";
  if ($("#translationEnabled")) $("#translationEnabled").checked = !!state.settings.translationEnabled;
  if ($("#translationEndpointUrl")) $("#translationEndpointUrl").value = state.settings.translationEndpointUrl || "";
  if ($("#translationDefaultDirection")) $("#translationDefaultDirection").value = state.settings.translationDefaultDirection || "auto";
}

function persist() {
  return persistAsync();
}

function schedulePersist(delay = 450) {
  window.clearTimeout(state.persistTimer);
  state.persistTimer = window.setTimeout(() => {
    state.persistTimer = null;
    persist();
  }, delay);
}

async function persistAsync() {
  if (!state.dataLoaded) {
    console.warn("Persist übersprungen: Datenbestand wurde noch nicht erfolgreich geladen.");
    return;
  }
  try {
    await Promise.all([
      ...state.projects.map((project) => idbPut("projects", normalizeProject(project))),
      ...state.protocols.map((protocol) => idbPut("protocols", stripRuntimeFields(protocol)))
    ]);
    await idbPut("masterData", normalizeMasterData(state.masterData));
    await idbPut("settings", { ...state.settings, id: "app" });
    showStorageWarning("");
  } catch (error) {
    showStorageWarning(`IndexedDB-Speicherfehler: ${error.message || error}`);
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("projects")) db.createObjectStore("projects", { keyPath: "id" });
      if (!db.objectStoreNames.contains("protocols")) db.createObjectStore("protocols", { keyPath: "id" });
      if (!db.objectStoreNames.contains("masterData")) db.createObjectStore("masterData", { keyPath: "id" });
      if (!db.objectStoreNames.contains("settings")) db.createObjectStore("settings", { keyPath: "id" });
      if (!db.objectStoreNames.contains("plans")) {
        const plans = db.createObjectStore("plans", { keyPath: "id" });
        plans.createIndex("protocolId", "protocolId", { unique: false });
      }
      const planStore = request.transaction.objectStore("plans");
      if (!planStore.indexNames.contains("projectId")) planStore.createIndex("projectId", "projectId", { unique: false });
      if (!planStore.indexNames.contains("acceptanceId")) planStore.createIndex("acceptanceId", "acceptanceId", { unique: false });
      if (!db.objectStoreNames.contains("photos")) {
        const photos = db.createObjectStore("photos", { keyPath: "id" });
        photos.createIndex("protocolId", "protocolId", { unique: false });
        photos.createIndex("pinId", "pinId", { unique: false });
        photos.createIndex("sampleId", "sampleId", { unique: false });
      }
      const photoStore = request.transaction.objectStore("photos");
      if (!photoStore.indexNames.contains("projectId")) photoStore.createIndex("projectId", "projectId", { unique: false });
      if (!photoStore.indexNames.contains("acceptanceId")) photoStore.createIndex("acceptanceId", "acceptanceId", { unique: false });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbStore(storeName, mode = "readonly") {
  return state.db.transaction(storeName, mode).objectStore(storeName);
}

function idbRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbGet(store, key) {
  return idbRequest(idbStore(store).get(key));
}

function idbGetAll(store) {
  return idbRequest(idbStore(store).getAll());
}

function idbPut(store, value) {
  return idbRequest(idbStore(store, "readwrite").put(value));
}

function idbPutComplete(store, value) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(store, "readwrite");
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error || new Error("IndexedDB-Transaktion fehlgeschlagen."));
    tx.onabort = () => reject(tx.error || new Error("IndexedDB-Transaktion abgebrochen."));
    tx.objectStore(store).put(value);
  });
}

function idbDelete(store, key) {
  return idbRequest(idbStore(store, "readwrite").delete(key));
}

function idbClear(store) {
  return idbRequest(idbStore(store, "readwrite").clear());
}

function idbCount(store) {
  return idbRequest(idbStore(store).count());
}

function stripRuntimeFields(protocol) {
  return normalizeProtocol(JSON.parse(JSON.stringify(protocol, (key, value) => {
    if (key === "dataUrl" || key === "renderedPages" || key === "objectUrl" || key === "blob") return undefined;
    return value;
  })));
}

async function migrateLocalStorageData() {
  const legacyRaw = localStorage.getItem(STORAGE_KEY);
  if (!legacyRaw) return;
  try {
    const legacyProtocols = JSON.parse(legacyRaw).map(normalizeProtocol);
    for (const protocol of legacyProtocols) {
      await migrateProtocolAssets(protocol);
      state.protocols.push(stripRuntimeFields(protocol));
      await idbPut("protocols", stripRuntimeFields(protocol));
    }
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    showStorageWarning("Alte localStorage-Testdaten konnten nicht automatisch migriert werden. In Einstellungen können lokale Testdaten gelöscht werden.");
  }
}

function normalizeProject(project = {}) {
  const address = normalizeAddress(project.address || project.siteAddress || project.baustellenAdresse || "");
  const clientSnapshot = project.clientSnapshot || snapshotCompany(resolveCompanyById(project.clientId) || resolveCompany(project.client || ""));
  const contractorSnapshot = project.contractorSnapshot || snapshotCompany(resolveCompanyById(project.contractorId) || resolveCompany(project.contractor || ""));
  const inspectorSnapshot = project.inspectorSnapshot || snapshotInspector(resolveInspectorById(project.inspectorId) || resolveInspector(project.inspector || ""));
  const defaultInspectorPersonSnapshot = project.defaultInspectorPersonSnapshot || snapshotOwnPerson(resolveOwnPersonById(project.defaultInspectorPersonId) || resolveOwnPerson(project.defaultInspector || ""));
  return {
    id: project.id || uid("project"),
    name: project.name || project.projectName || "Unbenanntes Projekt",
    address,
    siteAddress: formatAddress(address),
    clientId: project.clientId || clientSnapshot?.id || "",
    clientSnapshot,
    client: project.client || clientSnapshot?.name || "",
    contractorId: project.contractorId || contractorSnapshot?.id || "",
    contractorSnapshot,
    contractor: project.contractor || contractorSnapshot?.name || "",
    inspectorId: project.inspectorId || inspectorSnapshot?.id || "",
    inspectorSnapshot,
    inspector: project.inspector || inspectorSnapshot?.name || inspectorSnapshot?.office || "",
    defaultInspectorPersonId: project.defaultInspectorPersonId || defaultInspectorPersonSnapshot?.id || "",
    defaultInspectorPersonSnapshot,
    defaultInspector: project.defaultInspector || defaultInspectorPersonSnapshot?.name || "",
    planDate: project.planDate || "",
    note: project.note || "",
    dropboxFolder: project.dropboxFolder || project.dropboxProjectFolder || "",
    dropboxLink: project.dropboxLink || project.dropboxProjectLink || "",
    planFolder: project.planFolder || state.settings.dropboxPlanFolder || "Pläne",
    reportFolder: project.reportFolder || state.settings.dropboxReportFolder || "Berichte",
    photoFolder: project.photoFolder || state.settings.dropboxPhotoFolder || "Fotos",
    generalData: project.generalData || "",
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString()
  };
}

function normalizeMasterData(masterData = {}) {
  const source = { ...DEFAULT_MASTER_DATA, ...(masterData || {}) };
  return {
    id: "app",
    lastSavedAt: source.lastSavedAt || "",
    ownPersons: (source.ownPersons || []).map((item) => ({
      id: item.id || uid("person"),
      name: item.name || "",
      company: item.company || "",
      role: item.role || "",
      address: normalizeAddress(item.address || item.siteAddress || item.baustellenAdresse || ""),
      phone: item.phone || "",
      email: item.email || "",
      aliases: item.aliases || item.nickname || item.nickName || "",
      isDefault: !!item.isDefault
    })),
    companies: (source.companies || []).map((item) => ({
      id: item.id || uid("company"),
      name: item.name || "",
      role: item.role || "",
      contact: item.contact || "",
      phone: item.phone || "",
      email: item.email || "",
      address: normalizeAddress(item.address || item.siteAddress || item.baustellenAdresse || ""),
      note: item.note || ""
    })),
    inspectors: (source.inspectors || []).map((item) => ({
      id: item.id || uid("inspector"),
      name: item.name || "",
      office: item.office || "",
      address: normalizeAddress(item.address || item.siteAddress || item.baustellenAdresse || ""),
      email: item.email || "",
      phone: item.phone || "",
      note: item.note || ""
    })),
    components: uniqueValues(source.components || DEFAULT_MASTER_DATA.components),
    floors: uniqueValues(source.floors || DEFAULT_MASTER_DATA.floors),
    acceptanceTypes: uniqueValues(source.acceptanceTypes || DEFAULT_MASTER_DATA.acceptanceTypes),
    areaAxes: uniqueValues(source.areaAxes || DEFAULT_MASTER_DATA.areaAxes),
    signatureRoles: uniqueValues(source.signatureRoles || DEFAULT_MASTER_DATA.signatureRoles),
    trades: uniqueValues(source.trades || DEFAULT_MASTER_DATA.trades),
    siteControlTypes: uniqueValues(source.siteControlTypes || DEFAULT_MASTER_DATA.siteControlTypes),
    siteControlReasons: uniqueValues(source.siteControlReasons || DEFAULT_MASTER_DATA.siteControlReasons),
    siteControlPriorities: uniqueValues(source.siteControlPriorities || DEFAULT_MASTER_DATA.siteControlPriorities)
  };
}

function uniqueValues(values) {
  return Array.from(new Set((values || []).map((value) => String(value || "").trim()).filter(Boolean)));
}


function getProjectAddress(project = {}) {
  if (!project) return normalizeAddress();
  const direct = normalizeAddress(project.address || project.siteAddress || project.baustellenAdresse || project.location || "");
  const street = direct.street || project.street || project.siteStreet || project.addressStreet || project.road || "";
  const houseNumber = direct.houseNumber || project.houseNumber || project.house_number || project.streetNumber || project.siteHouseNumber || project.addressNumber || "";
  const zip = direct.zip || project.zip || project.postalCode || project.postcode || project.siteZip || "";
  const city = direct.city || project.city || project.town || project.siteCity || "";
  const country = direct.country || project.country || project.siteCountry || "Deutschland";
  return normalizeAddress({ street, houseNumber, zip, city, country });
}

function projectAddressText(project = {}, { multiline = false } = {}) {
  return formatAddress(getProjectAddress(project), { multiline });
}

function applySiteControlProjectAddress() {
  if (!isSiteControlProtocol()) return;
  const project = projectById(state.current.projectId);
  const text = projectAddressText(project, { multiline: false });
  const form = $("#siteControlForm");
  if (form?.elements?.siteAddress) form.elements.siteAddress.value = text;
  state.current.head.siteAddress = text;
  state.current.siteControl = normalizeSiteControlMeta(state.current.siteControl || {}, state.current);
  state.current.siteControl.address = text;
  persist();
  showAppToast("Adresse aus Projekt übernommen.", { type: "success" });
}

function normalizeTimeValue(value = "") {
  const text = String(value || "").trim();
  if (!text) return "";
  const hourOnly = text.match(/^(\d{1,2})$/);
  if (hourOnly) return `${hourOnly[1].padStart(2, "0")}:00`;
  const hourMinute = text.match(/^(\d{1,2}):(\d{0,2})$/);
  if (hourMinute) return `${hourMinute[1].padStart(2, "0")}:${(hourMinute[2] || "00").padEnd(2, "0").slice(0, 2)}`;
  return text;
}

function normalizeDailyWorker(worker = {}, index = 0) {
  const normalized = {
    id: worker.id || uid("worker"),
    name: worker.name || "",
    company: worker.company || "",
    role: worker.role || worker.activity || "",
    start: normalizeTimeValue(worker.start || worker.workStart || ""),
    end: normalizeTimeValue(worker.end || worker.workEnd || ""),
    breakHours: worker.breakHours || worker.pause || "",
    hours: worker.hours || "",
    note: worker.note || "",
    employeeId: worker.employeeId || worker.personId || "",
    source: worker.source || "manual",
    confidence: worker.confidence || "",
    matchStatus: worker.matchStatus || "",
    sourceName: worker.sourceName || "",
    order: Number(worker.order) || index + 1
  };
  normalized.hours = normalized.hours || workerHours(normalized);
  return normalized;
}

function normalizeDailyWorkers(workers = []) {
  return (workers || []).map(normalizeDailyWorker).sort((a, b) => (a.order || 0) - (b.order || 0));
}

function workerHours(worker = {}) {
  const start = normalizeTimeValue(worker.start || "");
  const end = normalizeTimeValue(worker.end || "");
  if (!start || !end) return worker.hours || "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if (![sh, sm, eh, em].every(Number.isFinite)) return worker.hours || "";
  let minutes = (eh * 60 + em) - (sh * 60 + sm);
  if (minutes < 0) minutes += 24 * 60;
  minutes -= Math.round((Number(worker.breakHours) || 0) * 60);
  if (minutes <= 0) return "";
  return (minutes / 60).toFixed(2).replace(".", ",");
}

function dailyWorkerById(id) {
  return (state.current?.dailyReport?.workers || []).find((worker) => worker.id === id) || null;
}

function normalizeAddress(value = {}) {
  if (typeof value === "string") {
    const text = value.trim();
    const match = text.match(/^(.*?)[,\s]+(\d{5})\s+(.+)$/);
    return {
      street: match ? match[1].trim().replace(/,\s*$/, "") : text,
      houseNumber: "",
      zip: match ? match[2].trim() : "",
      city: match ? match[3].trim() : "",
      country: "Deutschland"
    };
  }
  return {
    street: value.street || "",
    houseNumber: value.houseNumber || value.house_number || value.streetNumber || value.addressNumber || value.number || "",
    zip: value.zip || value.postalCode || value.postcode || "",
    city: value.city || value.town || "",
    country: value.country || "Deutschland"
  };
}

function formatAddress(address, { multiline = true } = {}) {
  const item = normalizeAddress(address);
  const street = String(item.street || "").trim();
  const houseNumber = String(item.houseNumber || "").trim();
  const streetLine = houseNumber && street && !street.endsWith(houseNumber) ? `${street} ${houseNumber}` : (street || houseNumber);
  const cityLine = [item.zip, item.city].filter(Boolean).join(" ");
  const parts = [streetLine, cityLine, item.country && item.country !== "Deutschland" ? item.country : ""].filter(Boolean);
  return parts.join(multiline ? "\n" : ", ");
}

function addressCity(address) {
  return normalizeAddress(address).city || "";
}

function getPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function setPath(object, path, value) {
  const keys = path.split(".");
  let target = object;
  keys.slice(0, -1).forEach((key) => {
    target[key] = target[key] || {};
    target = target[key];
  });
  target[keys[keys.length - 1]] = value;
}

function defaultOwnPerson() {
  return state.masterData?.ownPersons.find((person) => person.isDefault) || state.masterData?.ownPersons[0] || null;
}

function companyNames() {
  return uniqueValues((state.masterData?.companies || []).map(companyLabel));
}

function clientNames() {
  return companyNames();
}

function ownPersonNames() {
  return uniqueValues((state.masterData?.ownPersons || []).map(personLabel));
}

function personNames() {
  return uniqueValues([
    ...(state.masterData?.ownPersons || []).map(personLabel),
    ...(state.masterData?.inspectors || []).map(inspectorLabel),
    ...(state.masterData?.companies || []).map((company) => company.contact ? `${company.contact} – ${company.name}` : "")
  ]);
}

function companyLabel(company = {}) {
  return [company.name, addressCity(company.address)].filter(Boolean).join(" – ");
}

function personLabel(person = {}) {
  return [person.name, person.company].filter(Boolean).join(" – ");
}

function inspectorLabel(inspector = {}) {
  return [inspector.name, inspector.office].filter(Boolean).join(" – ");
}

function resolveCompany(value = "") {
  return (state.masterData?.companies || []).find((company) => value === company.name || value === companyLabel(company)) || null;
}

function resolveCompanyById(id = "") {
  return (state.masterData?.companies || []).find((company) => company.id === id) || null;
}

function resolveInspector(value = "") {
  return (state.masterData?.inspectors || []).find((item) => value === item.name || value === inspectorLabel(item) || value === item.office) || null;
}

function resolveInspectorById(id = "") {
  return (state.masterData?.inspectors || []).find((item) => item.id === id) || null;
}

function resolveOwnPerson(value = "") {
  return (state.masterData?.ownPersons || []).find((person) => value === person.name || value === personLabel(person)) || null;
}

function resolveOwnPersonById(id = "") {
  return (state.masterData?.ownPersons || []).find((person) => person.id === id) || null;
}

function snapshotCompany(company) {
  if (!company) return null;
  return {
    id: company.id || "",
    name: company.name || "",
    role: company.role || "",
    contact: company.contact || "",
    address: normalizeAddress(company.address),
    phone: company.phone || "",
    email: company.email || "",
    note: company.note || ""
  };
}

function snapshotInspector(inspector) {
  if (!inspector) return null;
  return {
    id: inspector.id || "",
    name: inspector.name || "",
    office: inspector.office || "",
    address: normalizeAddress(inspector.address),
    phone: inspector.phone || "",
    email: inspector.email || "",
    note: inspector.note || ""
  };
}

function snapshotOwnPerson(person) {
  if (!person) return null;
  return {
    id: person.id || "",
    name: person.name || "",
    company: person.company || "",
    role: person.role || "",
    address: normalizeAddress(person.address),
    phone: person.phone || "",
    email: person.email || "",
    isDefault: !!person.isDefault
  };
}

function companySelection(value = "") {
  const text = String(value || "").trim();
  const company = resolveCompany(text);
  return { text: company?.name || text, id: company?.id || "", snapshot: snapshotCompany(company) };
}

function ownPersonSelection(value = "") {
  const text = String(value || "").trim();
  const person = resolveOwnPerson(text);
  return { text: person?.name || text, id: person?.id || "", snapshot: snapshotOwnPerson(person) };
}

function ensureProjectStructure() {
  let changed = false;
  state.projects = state.projects.map(normalizeProject);
  const projectById = new Map(state.projects.map((project) => [project.id, project]));
  for (const protocol of state.protocols) {
    if (!protocol.projectId || !projectById.has(protocol.projectId)) {
      const project = normalizeProject({
        id: protocol.projectId || uid("project"),
        name: protocol.head?.projectName || "Unbenanntes Projekt",
        siteAddress: protocol.head?.siteAddress || "",
        createdAt: protocol.createdAt || protocol.updatedAt || new Date().toISOString(),
        updatedAt: protocol.updatedAt || new Date().toISOString()
      });
      protocol.projectId = project.id;
      state.projects.unshift(project);
      projectById.set(project.id, project);
      changed = true;
    }
    syncProtocolProjectFields(protocol, projectById.get(protocol.projectId), { overwriteProtocol: false });
  }
  return changed;
}

function syncProtocolProjectFields(protocol, project, { overwriteProtocol = true } = {}) {
  if (!protocol || !project) return;
  protocol.projectId = project.id;
  protocol.head = protocol.head || {};
  const address = normalizeAddress(project.address || project.siteAddress);
  if (overwriteProtocol || !protocol.head.projectName) protocol.head.projectName = project.name || "";
  if (overwriteProtocol || !protocol.head.siteAddress) {
    protocol.head.siteStreet = address.street;
    protocol.head.siteZip = address.zip;
    protocol.head.siteCity = address.city;
    protocol.head.siteCountry = address.country;
    protocol.head.siteAddress = formatAddress(address);
  }
  if (overwriteProtocol || !protocol.head.contractor) protocol.head.contractor = project.contractorSnapshot?.name || project.contractor || protocol.head.contractor || "";
  if (overwriteProtocol || !protocol.result?.inspectorName) {
    protocol.result = protocol.result || {};
    protocol.result.inspectorName = project.defaultInspectorPersonSnapshot?.name || project.defaultInspector || protocol.result.inspectorName || "";
  }
}

function projectById(projectId) {
  return state.projects.find((project) => project.id === projectId) || null;
}

function protocolsForProject(projectId) {
  return state.protocols
    .filter((protocol) => protocol.projectId === projectId)
    .sort((a, b) => String(b.head?.createdAt || b.updatedAt || "").localeCompare(String(a.head?.createdAt || a.updatedAt || "")));
}

function rebarProtocolsForProject(projectId) {
  return protocolsForProject(projectId).filter((protocol) => !isSiteControlProtocol(protocol) && !isDailyReportProtocol(protocol) && !isProjectPlanLibraryProtocol(protocol));
}

function siteControlProtocolsForProject(projectId) {
  return protocolsForProject(projectId).filter(isSiteControlProtocol);
}

function dailyReportProtocolsForProject(projectId) {
  return protocolsForProject(projectId).filter(isDailyReportProtocol);
}

function projectPlanLibraryProtocolsForProject(projectId) {
  return protocolsForProject(projectId).filter(isProjectPlanLibraryProtocol);
}

async function migrateProtocolAssets(protocol) {
  for (const plan of protocol.plans) {
    if (plan.dataUrl) {
      await idbPut("plans", {
        id: plan.id,
        projectId: protocol.projectId || "",
        acceptanceId: protocol.id,
        protocolId: protocol.id,
        fileName: plan.fileName,
        fileType: plan.type,
        blob: dataUrlToBlob(plan.dataUrl)
      });
      delete plan.dataUrl;
    }
    delete plan.renderedPages;
  }
  for (const pin of protocol.pins) {
    pin.photos = await migratePhotoRefs(pin.photos || [], protocol.id, { pinId: pin.id });
  }
  for (const check of protocol.checkpoints) {
    check.photos = await migratePhotoRefs(check.photos || [], protocol.id, { checkItemId: check.id });
    for (const sample of check.samples || []) {
      sample.photos = await migratePhotoRefs(sample.photos || [], protocol.id, { checkItemId: check.id, sampleId: sample.id });
    }
  }
}

async function migratePhotoRefs(photos, protocolId, link) {
  const migrated = [];
  for (const photo of photos) {
    const id = photo.id || uid("photo");
    if (photo.dataUrl) {
      await idbPut("photos", {
        id,
        projectId: state.protocols.find((protocol) => protocol.id === protocolId)?.projectId || "",
        acceptanceId: protocolId,
        protocolId,
        ...link,
        fileName: photo.name || photo.fileName || "Foto",
        fileType: photo.type || photo.fileType || "image/jpeg",
        blob: dataUrlToBlob(photo.dataUrl),
        note: photo.note || "",
        createdAt: photo.createdAt || new Date().toISOString()
      });
    }
    migrated.push({ id, name: photo.name || photo.fileName || "Foto", type: photo.type || photo.fileType || "image/jpeg", createdAt: photo.createdAt || new Date().toISOString(), barCountAnalysis: normalizeBarCountAnalysis(photo.barCountAnalysis) });
  }
  return migrated;
}

function showStorageWarning(message) {
  let warning = $("#storageWarning");
  if (!warning) {
    warning = document.createElement("div");
    warning.id = "storageWarning";
    warning.className = "storage-warning";
    ($(".view.active") || $("#planTab") || document.body).prepend(warning);
  }
  const target = $(".view.active") || $("#planTab") || document.body;
  if (message && !target.contains(warning)) target.prepend(warning);
  warning.textContent = message;
  warning.style.display = message ? "block" : "none";
}

function blankProtocol(project = null, seed = {}) {
  const createdAt = nowLocalInput();
  const sourceHead = seed.head || {};
  const sourceAddress = normalizeAddress(project?.address || sourceHead.siteAddress || {
    street: sourceHead.siteStreet || "",
    zip: sourceHead.siteZip || "",
    city: sourceHead.siteCity || "",
    country: sourceHead.siteCountry || "Deutschland"
  });
  return normalizeProtocol({
    id: seed.id || uid("protocol"),
    projectId: project?.id || seed.projectId || "",
    type: seed.type || "initial",
    kind: seed.kind || PROTOCOL_KIND_REBAR,
    parentProtocolId: seed.parentProtocolId || "",
    followupCreatedAt: seed.followupCreatedAt || "",
    version: "0.3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    head: {
      projectName: project?.name || sourceHead.projectName || "",
      siteStreet: sourceAddress.street,
      siteZip: sourceAddress.zip,
      siteCity: sourceAddress.city,
      siteCountry: sourceAddress.country,
      siteAddress: formatAddress(sourceAddress),
      acceptanceTitle: sourceHead.acceptanceTitle || "",
      acceptanceType: sourceHead.acceptanceType || "Erstabnahme",
      acceptanceTypeId: sourceHead.acceptanceTypeId || lookupSelection("acceptanceTypes", sourceHead.acceptanceType || "Erstabnahme").id,
      acceptanceTypeSnapshot: sourceHead.acceptanceTypeSnapshot || lookupSelection("acceptanceTypes", sourceHead.acceptanceType || "Erstabnahme").snapshot,
      component: sourceHead.component || "",
      componentId: sourceHead.componentId || lookupSelection("components", sourceHead.component || "").id,
      componentSnapshot: sourceHead.componentSnapshot || lookupSelection("components", sourceHead.component || "").snapshot,
      floor: sourceHead.floor || "",
      floorId: sourceHead.floorId || lookupSelection("floors", sourceHead.floor || "").id,
      floorSnapshot: sourceHead.floorSnapshot || lookupSelection("floors", sourceHead.floor || "").snapshot,
      areaAxes: sourceHead.areaAxes || "",
      planNumber: "",
      planDate: sourceHead.planDate || project?.planDate || "",
      contractor: sourceHead.contractor || project?.contractor || state.settings.defaultCompany || "",
      contractorId: sourceHead.contractorId || companySelection(sourceHead.contractor || project?.contractor || state.settings.defaultCompany || "").id,
      contractorSnapshot: sourceHead.contractorSnapshot || companySelection(sourceHead.contractor || project?.contractor || state.settings.defaultCompany || "").snapshot,
      inspectorPersonId: sourceHead.inspectorPersonId || ownPersonSelection(sourceHead.inspectorName || project?.defaultInspector || state.settings.defaultInspector || "").id,
      inspectorPersonSnapshot: sourceHead.inspectorPersonSnapshot || ownPersonSelection(sourceHead.inspectorName || project?.defaultInspector || state.settings.defaultInspector || "").snapshot,
      peoplePresent: sourceHead.peoplePresent || "",
      createdAt,
      generalNote: sourceHead.generalNote || ""
    },
    weather: {
      weatherDateTime: createdAt,
      weatherLocation: "",
      temperature: "",
      weatherCondition: "",
      precipitation: "nein",
      wind: "",
      humidity: "",
      siteConditions: ""
    },
    plans: seed.plans || [],
    activePlanId: "",
    pins: [],
    checkpoints: CHECK_ITEMS.map((title, index) => ({
      id: uid(`check-${index}`),
      title,
      status: "offen / nicht bewertet",
      note: "",
      pinId: "",
      photos: [],
      samples: []
    })),
    result: {
      resultStatus: "Zur Betonage freigegeben",
      finalNote: "",
      inspectorName: sourceHead.inspectorName || project?.defaultInspector || state.settings.defaultInspector || "",
      signatureText: ""
    },
    signatures: [],
    overviewPhotos: [],
    photos: []
  });
}

function normalizeProtocol(protocol) {
  protocol.version = protocol.version || "0.2";
  protocol.kind = protocol.kind || PROTOCOL_KIND_REBAR;
  protocol.type = protocol.type === "followup" ? "followup" : "initial";
  protocol.parentProtocolId = protocol.parentProtocolId || "";
  protocol.followupCreatedAt = protocol.followupCreatedAt || "";
  protocol.projectId = protocol.projectId || "";
  protocol.createdAt = protocol.createdAt || protocol.updatedAt || new Date().toISOString();
  protocol.head = protocol.head || {};
  protocol.head.acceptanceTitle = protocol.head.acceptanceTitle || protocol.acceptanceTitle || protocol.head.component || "";
  protocol.head.acceptanceType = protocol.head.acceptanceType || protocol.acceptanceType || "Erstabnahme";
  protocol.head.acceptanceTypeId = protocol.head.acceptanceTypeId || protocol.head.acceptanceType || "";
  protocol.head.acceptanceTypeSnapshot = protocol.head.acceptanceTypeSnapshot || lookupSelection("acceptanceTypes", protocol.head.acceptanceType).snapshot;
  protocol.head.component = protocol.head.component || "";
  protocol.head.componentId = protocol.head.componentId || protocol.head.component || "";
  protocol.head.componentSnapshot = protocol.head.componentSnapshot || lookupSelection("components", protocol.head.component).snapshot;
  protocol.head.floor = protocol.head.floor || "";
  protocol.head.floorId = protocol.head.floorId || protocol.head.floor || "";
  protocol.head.floorSnapshot = protocol.head.floorSnapshot || lookupSelection("floors", protocol.head.floor).snapshot;
  const contractorSelection = companySelection(protocol.head.contractor || "");
  protocol.head.contractor = protocol.head.contractor || contractorSelection.text;
  protocol.head.contractorId = protocol.head.contractorId || contractorSelection.id;
  protocol.head.contractorSnapshot = protocol.head.contractorSnapshot || contractorSelection.snapshot;
  const inspectorSelection = ownPersonSelection(protocol.result?.inspectorName || protocol.head.inspectorName || "");
  protocol.head.inspectorPersonId = protocol.head.inspectorPersonId || inspectorSelection.id;
  protocol.head.inspectorPersonSnapshot = protocol.head.inspectorPersonSnapshot || inspectorSelection.snapshot;
  protocol.head.projectName = protocol.head.projectName || "";
  protocol.head.inspectionDateTime = protocol.head.inspectionDateTime || protocol.head.reportDateTime || protocol.head.createdAt || protocol.weather?.weatherDateTime || nowLocalInput();
  const protocolAddress = normalizeAddress(protocol.head.siteAddress || {
    street: protocol.head.siteStreet || "",
    zip: protocol.head.siteZip || "",
    city: protocol.head.siteCity || "",
    country: protocol.head.siteCountry || "Deutschland"
  });
  protocol.head.siteStreet = protocol.head.siteStreet || protocolAddress.street;
  protocol.head.siteZip = protocol.head.siteZip || protocolAddress.zip;
  protocol.head.siteCity = protocol.head.siteCity || protocolAddress.city;
  protocol.head.siteCountry = protocol.head.siteCountry || protocolAddress.country;
  protocol.head.siteAddress = formatAddress({
    street: protocol.head.siteStreet,
    zip: protocol.head.siteZip,
    city: protocol.head.siteCity,
    country: protocol.head.siteCountry
  });
  protocol.plans = protocol.plans || [];
  protocol.pins = protocol.pins || [];
  protocol.signatures = (protocol.signatures || []).map(normalizeSignature);
  protocol.overviewPhotos = normalizeOverviewPhotos(protocol.overviewPhotos || [], protocol.id);
  if (protocol.plan && !protocol.plans.length) {
    const planId = uid("plan");
    protocol.plans.push({
      id: planId,
      number: 1,
      fileName: protocol.plan.name || "Plan 1",
      title: "",
      planNumber: protocol.head?.planNumber || "",
      planDate: protocol.head?.planDate || "",
      remark: "",
      type: protocol.plan.type || "",
      dataUrl: protocol.plan.dataUrl || "",
      pageCount: protocol.plan.type === "application/pdf" ? 0 : 1,
      currentPage: 1,
      renderedPages: {},
      renderError: protocol.plan.pdfNotice || ""
    });
    protocol.pins = (protocol.pins || []).map((pin) => ({
      ...pin,
      planId,
      pageNumber: pin.pageNumber || 1
    }));
    protocol.activePlanId = planId;
    delete protocol.plan;
  }
  protocol.plans.forEach((plan, index) => {
    plan.id = plan.id || uid("plan");
    plan.number = plan.number || index + 1;
    plan.fileName = plan.fileName || plan.name || `Plan ${index + 1}`;
    plan.title = plan.title || "";
    plan.planNumber = plan.planNumber || "";
    plan.planDate = plan.planDate || "";
    plan.planIndex = plan.planIndex || "";
    plan.documentStatus = plan.documentStatus || "verwendet";
    normalizePlanMeta(plan);
    plan.autoMetaStatus = plan.autoMetaStatus || "";
    plan.planDateCandidates = Array.isArray(plan.planDateCandidates) ? plan.planDateCandidates : [];
    plan.remark = plan.remark || "";
    plan.type = plan.type || "";
    plan.fileSize = numberOrDefault(plan.fileSize, 0);
    plan.pageCount = plan.pageCount || (plan.type === "application/pdf" ? 0 : 1);
    plan.currentPage = plan.currentPage || 1;
    plan.zoom = plan.zoom || 1;
    plan.renderStatus = plan.renderStatus || "idle";
    plan.renderError = plan.renderError || "";
  });
  protocol.pins.forEach((pin, index) => {
    pin.id = pin.id || uid("pin");
    pin.number = pin.number || index + 1;
    pin.planId = pin.planId || protocol.plans[0]?.id || "";
    pin.pageNumber = pin.pageNumber || 1;
    pin.x = numberOrDefault(pin.x, 0.5);
    pin.y = numberOrDefault(pin.y, 0.5);
    pin.placements = normalizePinPlacements(pin);
    pin.title = pin.title || "";
    pin.status = pin.status || "teilweise / Auflage";
    pin.note = pin.note || "";
    pin.photos = (pin.photos || []).map(normalizePhotoRef);
    pin.checkItemId = pin.checkItemId || pin.checkpointIds?.[0] || "";
    pin.sampleId = pin.sampleId || "";
    pin.xPercent = numberOrDefault(pin.xPercent, pin.x);
    pin.yPercent = numberOrDefault(pin.yPercent, pin.y);
    pin.createdAt = pin.createdAt || new Date().toISOString();
    pin.updatedAt = pin.updatedAt || pin.createdAt;
    pin.checkpointIds = pin.checkpointIds || [];
  });
  protocol.activePlanId = protocol.activePlanId || protocol.plans[0]?.id || "";
  protocol.checkpoints = protocol.checkpoints || CHECK_ITEMS.map((title, index) => ({
    id: uid(`check-${index}`),
    title,
    active: false,
    manuallyActivated: false,
    status: "offen / nicht bewertet",
    note: "",
    pinId: "",
    photos: [],
    samples: []
  }));
  if (protocol.type === "followup") ensureFollowupCatalogChecks(protocol);
  const templateKey = checkTemplateKey(protocol.head.component || protocol.head.acceptanceTitle || "");
  const templateActive = new Set((CHECK_SCOPE_TEMPLATES[templateKey] || CHECK_ITEMS).map((title) => title.toLowerCase()));
  protocol.checkpoints.forEach((check, index) => {
    check.id = check.id || uid(`check-${index}`);
    check.title = check.title || CHECK_ITEMS[index] || `Prüfpunkt ${index + 1}`;
    if (check.title === "Durchstanzbewehrung") check.title = "Durchstanzbewehrung/Schubbewehrung";
    check.status = check.status || "offen / nicht bewertet";
    check.note = check.note || "";
    check.pinId = check.pinId || "";
    check.photos = (check.photos || []).map(normalizePhotoRef);
    check.samples = check.samples || [];
    if (!check.samples.length && (check.note || check.pinId || check.photos.length || (check.status && check.status !== "nicht relevant" && check.status !== "offen / nicht bewertet"))) {
      const legacyPin = protocol.pins.find((pin) => pin.id === check.pinId);
      check.samples.push(normalizeSample({
        checkItemId: check.id,
        number: 1,
        location: "bisherige Hauptbewertung",
        status: check.status === "offen / nicht bewertet" ? "nicht relevant" : check.status,
        note: check.note,
        planId: legacyPin?.planId || "",
        pageNumber: legacyPin?.pageNumber || 1,
        pinId: check.pinId,
        photos: check.photos
      }, check.id, 1));
      check.photos = [];
    }
    check.samples.forEach((sample, sampleIndex) => normalizeSample(sample, check.id, sampleIndex + 1));
    updateCheckStatus(check);
    const documented = checkHasDocumentation(check) || checkHasIssue(check);
    check.manuallyActivated = !!check.manuallyActivated;
    check.active = check.active ?? (documented || templateActive.has((check.title || "").toLowerCase()));
    if (documented) check.active = true;
  });
  protocol.result = {
    resultStatus: "Zur Betonage freigegeben",
    finalNote: "",
    inspectorName: "",
    signatureText: "",
    ...(protocol.result || {})
  };
  protocol.siteControl = normalizeSiteControlMeta(protocol.siteControl || {}, protocol);
  protocol.siteItems = normalizeSiteControlItems(protocol.siteItems || [], protocol.id);
  protocol.dailyReport = normalizeDailyReportMeta(protocol.dailyReport || {}, protocol);
  syncResultLookupFields(protocol);
  return protocol;
}

function isSiteControlProtocol(protocol = state.current) {
  return (protocol?.kind || PROTOCOL_KIND_REBAR) === PROTOCOL_KIND_SITE_CONTROL;
}

function isDailyReportProtocol(protocol = state.current) {
  return (protocol?.kind || PROTOCOL_KIND_REBAR) === PROTOCOL_KIND_DAILY_REPORT;
}

function isProjectPlanLibraryProtocol(protocol = state.current) {
  return (protocol?.kind || PROTOCOL_KIND_REBAR) === PROTOCOL_KIND_PROJECT_PLANS;
}

function normalizeSiteControlMeta(meta = {}, protocol = {}) {
  return {
    reason: meta.reason || protocol.head?.acceptanceType || "Regelbegehung",
    area: meta.area || protocol.head?.areaAxes || "",
    participants: meta.participants || protocol.head?.peoplePresent || "",
    address: meta.address || protocol.head?.siteAddress || protocol.head?.siteAddressText || "",
    weather: meta.weather || protocol.weather?.weatherCondition || "",
    finalNote: meta.finalNote || protocol.result?.finalNote || ""
  };
}

function normalizeSiteControlItems(items = [], protocolId = "") {
  return (items || []).map((item, index) => ({
    id: item.id || uid("siteitem"),
    protocolId: item.protocolId || protocolId,
    number: item.number || index + 1,
    type: item.type || "Hinweis",
    trade: item.trade || "",
    location: item.location || "",
    responsible: item.responsible || "",
    dueDate: item.dueDate || "",
    priority: item.priority || "normal",
    status: item.status || "offen",
    description: item.description || item.note || "",
    planReference: item.planReference || "",
    pinId: item.pinId || "",
    planId: item.planId || "",
    pageNumber: Math.max(1, Number(item.pageNumber) || 1),
    photos: (item.photos || []).map(normalizePhotoRef),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  }));
}



function normalizeDailyReportMeta(meta = {}, protocol = {}) {
  const dateFromHead = (protocol.head?.createdAt || protocol.createdAt || nowLocalInput()).slice(0, 10);
  return {
    reportNumber: meta.reportNumber || "",
    status: meta.status || "Entwurf",
    date: meta.date || dateFromHead,
    workStart: meta.workStart || "",
    workEnd: meta.workEnd || "",
    breakHours: meta.breakHours || "",
    totalHours: meta.totalHours || "",
    crew: meta.crew || "",
    company: meta.company || "",
    personCount: meta.personCount || "",
    foreman: meta.foreman || "",
    area: meta.area || "",
    trade: meta.trade || "",
    inputLanguage: meta.inputLanguage || "de",
    translationStatus: meta.translationStatus || "nicht übersetzt",
    workOriginal: meta.workOriginal || "",
    workGerman: meta.workGerman || "",
    workAlbanian: meta.workAlbanian || "",
    workDescription: meta.workDescription || "",
    materials: meta.materials || "",
    equipment: meta.equipment || "",
    incidentsOriginal: meta.incidentsOriginal || "",
    incidentsGerman: meta.incidentsGerman || "",
    incidentsAlbanian: meta.incidentsAlbanian || "",
    delays: meta.delays || "",
    defects: meta.defects || "",
    weather: meta.weather || protocol.weather?.weatherCondition || "",
    confirmedBy: meta.confirmedBy || "",
    source_audio_ids: meta.source_audio_ids || [],
    raw_transcript: meta.raw_transcript || meta.voiceDraft || "",
    voiceDraft: meta.voiceDraft || meta.raw_transcript || "",
    cleaned_text_de: meta.cleaned_text_de || meta.translated_text_de || meta.workGerman || "",
    original_language: meta.original_language || meta.inputLanguage || "de",
    original_text: meta.original_text || meta.workOriginal || meta.voiceDraft || meta.raw_transcript || "",
    translated_text_de: meta.translated_text_de || meta.workGerman || meta.cleaned_text_de || "",
    translation_used: !!meta.translation_used,
    translation_checked: !!meta.translation_checked,
    translation_created_at: meta.translation_created_at || "",
    translation_provider: meta.translation_provider || "",
    translation_warning: meta.translation_warning || "",
    field_sources: meta.field_sources || {},
    field_confidence: meta.field_confidence || {},
    ai_form_extraction_used: !!meta.ai_form_extraction_used,
    user_confirmed: !!meta.user_confirmed,
    signed_at: meta.signed_at || "",
    report_status: meta.report_status || meta.status || "draft",
    mitarbeiter_count_spoken: meta.mitarbeiter_count_spoken || "",
    selected_employee_ids: meta.selected_employee_ids || [],
    unmatched_employee_names: meta.unmatched_employee_names || [],
    employee_field_sources: meta.employee_field_sources || [],
    employee_confidence: meta.employee_confidence || "",
    ai_employee_extraction_used: !!meta.ai_employee_extraction_used,
    voice_warnings: meta.voice_warnings || [],
    workers: normalizeDailyWorkers(meta.workers || []),
    photos: (meta.photos || []).map((photo) => ({ ...normalizePhotoRef(photo), caption: photo.caption || "" }))
  };
}

function dailyReportTotalHours(report = {}) {
  const start = normalizeTimeValue(report.workStart || "");
  const end = normalizeTimeValue(report.workEnd || "");
  if (!start || !end) return report.totalHours || "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if (![sh, sm, eh, em].every(Number.isFinite)) return report.totalHours || "";
  let minutes = (eh * 60 + em) - (sh * 60 + sm);
  if (minutes < 0) minutes += 24 * 60;
  minutes -= Math.round((Number(report.breakHours) || 0) * 60);
  if (minutes <= 0) return "";
  return (minutes / 60).toFixed(2).replace(".", ",");
}

function ensureFollowupCatalogChecks(protocol) {
  const existing = new Set((protocol.checkpoints || []).map((check) => normalizeCheckTitle(check.title || "")));
  CHECK_ITEMS.forEach((title, index) => {
    const key = normalizeCheckTitle(title);
    if (existing.has(key)) return;
    protocol.checkpoints.push({
      id: uid(`check-followup-catalog-${index}`),
      title,
      active: false,
      manuallyActivated: false,
      status: "offen / nicht bewertet",
      note: "",
      pinId: "",
      photos: [],
      samples: [],
      isFollowupNew: true,
      createdInProtocolId: protocol.id || "",
      originProtocolId: null
    });
    existing.add(key);
  });
}

function normalizePinPlacements(pin) {
  const placements = Array.isArray(pin.placements) ? pin.placements : [];
  const normalized = placements
    .filter((placement) => placement?.planId)
    .map((placement, index) => ({
      id: placement.id || uid("placement"),
      planId: placement.planId,
      pageNumber: placement.pageNumber || 1,
      x: numberOrDefault(placement.x, numberOrDefault(pin.x, 0.5)),
      y: numberOrDefault(placement.y, numberOrDefault(pin.y, 0.5)),
      label: placement.label || "",
      isPrimary: placement.isPrimary ?? index === 0
    }));
  if (!normalized.length && pin.planId) {
    normalized.push({
      id: uid("placement"),
      planId: pin.planId,
      pageNumber: pin.pageNumber || 1,
      x: numberOrDefault(pin.x, 0.5),
      y: numberOrDefault(pin.y, 0.5),
      label: "",
      isPrimary: true
    });
  }
  if (normalized.length && !normalized.some((placement) => placement.isPrimary)) normalized[0].isPrimary = true;
  return normalized;
}

function normalizeSignature(signature = {}) {
  const person = ownPersonSelection(signature.name || "");
  const company = companySelection(signature.company || person.snapshot?.company || "");
  return {
    id: signature.id || uid("sig"),
    name: signature.name || person.text || "",
    personId: signature.personId || person.id,
    personSnapshot: signature.personSnapshot || person.snapshot,
    company: signature.company || person.snapshot?.company || company.text || "",
    companyId: signature.companyId || company.id,
    companySnapshot: signature.companySnapshot || company.snapshot,
    role: signature.role || "",
    roleSnapshot: signature.roleSnapshot || (signature.role ? { value: signature.role, label: signature.role } : null),
    category: signature.category || "Verantwortlicher vor Ort",
    note: signature.note || "",
    signedAt: signature.signedAt || nowLocalInput(),
    signatureData: signature.signatureData || ""
  };
}

function normalizeSample(sample, checkItemId, number) {
  sample.id = sample.id || uid("sample");
  sample.checkItemId = sample.checkItemId || checkItemId;
  sample.number = sample.number || number;
  sample.location = sample.location || sample.title || "";
  sample.status = sample.status || "nicht relevant";
  sample.note = sample.note || "";
  sample.planId = sample.planId || "";
  sample.pageNumber = sample.pageNumber || 1;
  sample.pinId = sample.pinId || "";
  sample.photos = (sample.photos || []).map(normalizePhotoRef);
  sample.referencePhotos = (sample.referencePhotos || []).map(normalizePhotoRef);
  sample.sourceStatus = sample.sourceStatus || "";
  sample.sourceNote = sample.sourceNote || "";
  sample.sourcePinId = sample.sourcePinId || "";
  sample.sourcePlanId = sample.sourcePlanId || "";
  sample.sourcePageNumber = sample.sourcePageNumber || 1;
  sample.followupStatus = sample.followupStatus || "";
  sample.followupNote = sample.followupNote || "";
  sample.followupPhotos = (sample.followupPhotos || []).map(normalizePhotoRef);
  sample.isFollowupNew = !!sample.isFollowupNew;
  sample.createdInProtocolId = sample.createdInProtocolId || "";
  sample.originProtocolId = sample.originProtocolId || null;
  sample.overlapCheck = normalizeOverlapCheck(sample.overlapCheck || sample.overlapCalc || null);
  delete sample.overlapCalc;
  sample.createdAt = sample.createdAt || new Date().toISOString();
  sample.updatedAt = sample.updatedAt || sample.createdAt;
  return sample;
}

function normalizePhotoRef(photo = {}) {
  const backupStatus = normalizePhotoBackupStatus(photo.external_backup_status || photo.externalBackupStatus || photo.backupStatus || "unknown");
  return {
    id: photo.id || uid("photo"),
    name: photo.name || photo.fileName || "Foto",
    type: photo.type || photo.fileType || "image/jpeg",
    createdAt: photo.createdAt || new Date().toISOString(),
    barCountAnalysis: normalizeBarCountAnalysis(photo.barCountAnalysis),
    external_backup_status: backupStatus,
    external_backup_at: photo.external_backup_at || photo.externalBackupAt || "",
    external_backup_method: photo.external_backup_method || photo.externalBackupMethod || "",
    original_capture_source: photo.original_capture_source || photo.originalCaptureSource || ""
  };
}

function normalizePhotoBackupStatus(status = "") {
  const value = String(status || "").trim();
  return ["unknown", "app_only", "share_started", "download_started", "user_confirmed_external"].includes(value) ? value : "unknown";
}

function photoBackupStatus(photo = {}) {
  return normalizePhotoBackupStatus(photo.external_backup_status || photo.externalBackupStatus || photo.backupStatus || (photo.original_capture_source === "gallery" ? "user_confirmed_external" : "app_only"));
}

function photoBackupStatusLabel(photo = {}) {
  const status = photoBackupStatus(photo);
  if (status === "user_confirmed_external") return "Extern gesichert";
  if (status === "share_started") return "Share gestartet";
  if (status === "download_started") return "Download gestartet";
  if (photo.original_capture_source === "gallery" || photo.external_backup_method === "gallery_input") return "Aus Galerie übernommen";
  return "Extern offen";
}

function photoBackupBadge(photo = {}) {
  const status = photoBackupStatus(photo);
  const cls = status === "user_confirmed_external" ? "ok" : (status === "share_started" || status === "download_started" ? "started" : "open");
  return `<span class="photo-backup-badge ${cls}">${escapeHtml(photoBackupStatusLabel(photo))}</span>`;
}
function normalizeBarCountAnalysis(analysis = null) {
  if (!analysis) return null;
  return {
    photoId: analysis.photoId || "",
    mode: "assistive",
    selectedRegion: analysis.selectedRegion || null,
    direction: analysis.direction || "auto",
    detectedCount: numberOrEmpty(analysis.detectedCount),
    confirmedCount: numberOrEmpty(analysis.confirmedCount),
    confidence: numberOrEmpty(analysis.confidence),
    userConfirmed: !!analysis.userConfirmed,
    note: analysis.note || ""
  };
}

function normalizeOverlapCheck(overlapCheck) {
  if (!overlapCheck) return null;
  const diameter = numberOrEmpty(overlapCheck.diameterMm);
  const diameterPresets = ["6", "8", "10", "12", "14", "16", "20", "25", "28", "32"];
  const diameterMode = overlapCheck.diameterMode || (diameterPresets.includes(String(diameter)) ? String(diameter) : (diameter ? "custom" : "12"));
  const asRatio = numberOrDefault(overlapCheck.asReqAsProv, 1);
  const normalized = {
    mode: overlapCheck.mode || OVERLAP_PLAN_MODE,
    diameterMode,
    diameterCustomMm: numberOrEmpty(overlapCheck.diameterCustomMm || (diameterMode === "custom" ? diameter : "")),
    diameterMm: diameter || 12,
    concreteClass: overlapCheck.concreteClass || "C25/30",
    steelGrade: overlapCheck.steelGrade || "B500B",
    bondCondition: overlapCheck.bondCondition || "unknown",
    stressType: overlapCheck.stressType || "unknown",
    spliceRatio: overlapCheck.spliceRatio || "unknown",
    sigmaMode: overlapCheck.sigmaMode || "fyd",
    sigmaSd: numberOrEmpty(overlapCheck.sigmaSd),
    asRatioMode: overlapCheck.asRatioMode || (["1", "0.8", "0.7", "0.6"].includes(String(asRatio)) ? String(asRatio) : "manual"),
    asReqAsProv: asRatio,
    alpha1Mode: overlapCheck.alpha1Mode || "conservative",
    alpha2Mode: overlapCheck.alpha2Mode || "conservative",
    alpha3Mode: overlapCheck.alpha3Mode || "conservative",
    alpha5Mode: overlapCheck.alpha5Mode || "conservative",
    alpha1: numberOrDefault(overlapCheck.alpha1, 1),
    alpha2: numberOrDefault(overlapCheck.alpha2, 1),
    alpha3: numberOrDefault(overlapCheck.alpha3, 1),
    alpha5: numberOrDefault(overlapCheck.alpha5, 1),
    alpha6: numberOrEmpty(overlapCheck.alpha6),
    requiredFromPlanMm: numberOrEmpty(overlapCheck.requiredFromPlanMm),
    requiredFromPlanUnit: overlapCheck.requiredFromPlanUnit || "cm",
    measuredMm: numberOrEmpty(overlapCheck.measuredMm ?? overlapCheck.existingMm),
    measuredUnit: overlapCheck.measuredUnit || "cm",
    differenceMm: numberOrEmpty(overlapCheck.differenceMm),
    resultStatus: overlapCheck.resultStatus || "",
    planId: overlapCheck.planId || "",
    pageNumber: overlapCheck.pageNumber || 1,
    pinId: overlapCheck.pinId || "",
    note: overlapCheck.note || "",
    generatedText: overlapCheck.generatedText || overlapCheck.generatedNote || ""
  };
  [
    "fctk005", "gammaC", "alphaCt", "fctd", "eta1", "eta2", "fbd",
    "lbRqd", "l0", "l0Min", "requiredMm"
  ].forEach((key) => {
    normalized[key] = numberOrEmpty(overlapCheck[key]);
  });
  return normalized;
}

function showView(id) {
  if (state.planRender) state.planRender.token += 1;
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === id));
  updateAppHeader(id);
  renderBrowserWarnings();
  if (id === "projectDirectoryView") renderProjectDirectory();
  if (id === "projectHubView") renderProjectHub();
  if (id === "projectPlansView") renderProjectPlansView();
  if (id === "listView") renderList();
  if (id === "siteControlView") renderSiteControlView();
  if (id === "dailyReportView") renderDailyReportView();
  if (id === "masterDataView") {
    renderDatalists();
    renderMasterData();
  }
}

function updateAppHeader(viewId = activeViewId()) {
  const eyebrow = $(".appbar-title .eyebrow");
  const back = $("#backBtn");
  const labels = {
    homeView: "Startseite",
    projectDirectoryView: "Projektverwaltung",
    projectHubView: "Projektzentrale",
    projectPlansView: "Projektpläne",
    listView: "Bewehrungsabnahme",
    siteControlView: "Baustellenkontrolle",
    siteControlEditorView: "Baustellenkontrolle",
    dailyReportView: "Bautagesbericht",
    dailyReportEditorView: "Bautagesbericht",
    editorView: "Bewehrungsabnahme",
    masterDataView: state.masterDataSection ? `Stammdaten \u00b7 ${masterDataSectionMeta(state.masterDataSection)?.title || "Detail"}` : "Stammdaten",
    settingsView: "Einstellungen / Backup"
  };
  if (eyebrow) eyebrow.textContent = labels[viewId] || "Kai BauSuite";
  if (back) back.classList.toggle("hidden", viewId === "homeView");
}
function activeViewId() {
  return $(".view.active")?.id || "homeView";
}

function isAndroidFirefox() {
  const ua = navigator.userAgent || "";
  return /Android/i.test(ua) && /(Firefox\/|Fennec\/)/i.test(ua);
}

function androidFirefoxWarningText() {
  return "Hinweis: Firefox auf Android kann technische PDF-/Bewehrungspläne fehlerhaft darstellen. Bitte für Bewehrungsabnahmen Chrome verwenden.";
}

function renderBrowserWarnings() {
  const shouldWarn = isAndroidFirefox();
  ["#androidFirefoxPlanWarning", "#androidFirefoxMarkWarning"].forEach((selector) => {
    const node = $(selector);
    if (!node) return;
    node.textContent = androidFirefoxWarningText();
    node.classList.toggle("hidden", !shouldWarn);
  });
  const info = $("#browserRecommendationInfo");
  if (info) {
    info.textContent = shouldWarn
      ? `${androidFirefoxWarningText()} Empfohlen für Baustellennutzung: Android Chrome.`
      : "Empfohlen für Baustellennutzung: Android Chrome.";
  }
}

function setMasterDataDirty(dirty) {
  state.masterDataDirty = !!dirty;
  updateMasterDataSaveStatus();
}

function updateMasterDataSaveStatus(message = "") {
  const status = $("#masterDataSaveStatus");
  if (!status) return;
  status.textContent = message || (state.masterDataDirty ? "Ungespeicherte Stammdaten" : "Alle Stammdaten gespeichert");
  status.classList.toggle("dirty", state.masterDataDirty);
}

function showAppToast(message, { type = "success", timeout = 4200 } = {}) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "app-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  window.clearTimeout(state.toastTimer);
  toast.className = `app-toast ${type} visible`;
  toast.innerHTML = `<strong>${type === "success" ? "Erfolg" : "Hinweis"}</strong><span>${escapeHtml(message)}</span>`;
  state.toastTimer = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, timeout);
}

async function navigateToView(id, options = {}) {
  const currentView = activeViewId();
  if (id === "projectPlansView" && currentView === "editorView" && state.current) {
    state.projectPlansReturn = { view: "editorView", tab: activeProtocolTabId() || "planTab" };
  } else if (currentView === "projectPlansView" && id !== "projectPlansView" && !options.keepProjectPlansReturn) {
    state.projectPlansReturn = null;
  }
  if (id === "masterDataView" && currentView !== "masterDataView") state.masterDataSection = "";
  if (currentView === "masterDataView" && id !== "masterDataView") {
    const canLeave = await confirmLeaveMasterData();
    if (!canLeave) return false;
  }
  if (id !== currentView && !options.replace) {
    state.viewHistory.push(currentView);
    if (state.viewHistory.length > 30) state.viewHistory.shift();
  }
  showView(id);
  return true;
}

async function navigateBackOneStep(fallbackView = "homeView") {
  const currentView = activeViewId();
  while (state.viewHistory.length) {
    const previousView = state.viewHistory.pop();
    if (previousView && previousView !== currentView && document.getElementById(previousView)) {
      await navigateToView(previousView, { replace: true });
      return true;
    }
  }
  if (fallbackView && fallbackView !== currentView && document.getElementById(fallbackView)) {
    await navigateToView(fallbackView, { replace: true });
    return true;
  }
  return false;
}

function rememberProjectPlansReturnContext() {
  if (activeViewId() === "editorView" && state.current) {
    state.projectPlansReturn = { view: "editorView", tab: activeProtocolTabId() || "planTab" };
  } else {
    state.projectPlansReturn = null;
  }
}

async function returnFromProjectPlansView() {
  const target = state.projectPlansReturn;
  state.projectPlansReturn = null;
  if (target?.view === "editorView" && state.current) {
    await navigateToView("editorView", { replace: true, keepProjectPlansReturn: true });
    activateProtocolTab(target.tab || "planTab", { replace: true });
    return true;
  }
  return false;
}

async function discardMasterDataChanges() {
  state.masterData = normalizeMasterData(await idbGet("masterData", "app"));
  setMasterDataDirty(false);
  renderDatalists();
  renderMasterData();
}

function askUnsavedMasterData() {
  return new Promise((resolve) => {
    const dialog = $("#unsavedMasterDataDialog");
    state.pendingMasterDataLeaveResolve = resolve;
    dialog.showModal();
  });
}

async function confirmLeaveMasterData() {
  if (!state.masterDataDirty) return true;
  const action = await askUnsavedMasterData();
  if (action === "save") return saveMasterData({ alertSuccess: false });
  if (action === "discard") {
    await discardMasterDataChanges();
    return true;
  }
  return false;
}

function activeProtocolTabId() {
  return $(".tab-panel.active")?.id || "headTab";
}

function activateProtocolTab(tabId, options = {}) {
  $$(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabId));
  $$(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === tabId));
  if (tabId === "checkTab") renderChecklist();
  if (tabId === "planTab") renderPlan();
  if (tabId === "resultTab") {
    renderOverviewPhotos();
    renderSignatures();
  }
}

function returnToResultAfterPrint() {
  if (state.reportReturnDone) return;
  state.reportReturnDone = true;
  const dialog = $("#reportDialog");
  if (dialog?.open) dialog.close();
  document.body.classList.remove("report-open");
  if (isDailyReportProtocol()) {
    showView("dailyReportEditorView");
    renderDailyReportEditor();
    return;
  }
  if (isSiteControlProtocol()) {
    showView("siteControlEditorView");
    renderSiteControlEditor();
    return;
  }
  activateProtocolTab("resultTab");
}

function armReturnToResultAfterPrint() {
  state.reportReturnDone = false;
  const done = () => {
    cleanup();
    window.setTimeout(returnToResultAfterPrint, 50);
  };
  const onVisibility = () => {
    if (document.visibilityState === "visible") done();
  };
  const cleanup = () => {
    window.removeEventListener("afterprint", done);
    window.removeEventListener("focus", done);
    document.removeEventListener("visibilitychange", onVisibility);
  };
  window.addEventListener("afterprint", done, { once: true });
  window.addEventListener("focus", done, { once: true });
  document.addEventListener("visibilitychange", onVisibility);
  window.setTimeout(done, 2500);
}

function openProtocol(protocol) {
  if (isDailyReportProtocol(protocol)) {
    openDailyReportProtocol(protocol);
    return;
  }
  if (isSiteControlProtocol(protocol)) {
    openSiteControlProtocol(protocol);
    return;
  }
  state.current = normalizeProtocol(protocol);
  state.currentProjectId = state.current.projectId || "";
  const project = projectById(state.currentProjectId);
  if (project) syncProtocolProjectFields(state.current, project, { overwriteProtocol: false });
  const availablePlans = plansForCurrentProtocol();
  state.selectedPlanId = availablePlans.find((plan) => plan.id === state.current.activePlanId)?.id || availablePlans[0]?.id || "";
  state.current.activePlanId = state.selectedPlanId;
  state.selectedPinId = currentPins()[0]?.id || "";
  state.pinMode = false;
  state.placementModePinId = "";
  fillForm();
  renderPlanControls();
  renderPlan();
  renderPinEditor();
  renderChecklist();
  showView("editorView");
}

function createProject() {
  openProjectDialog();
}

function openProjectDialog(projectId = "") {
  const project = projectId ? projectById(projectId) : null;
  state.projectDialogReturnView = $(".view.active")?.id || state.projectDialogReturnView || "homeView";
  $("#projectDialogTitle").textContent = project ? "Projekt bearbeiten" : "Neues Projekt";
  $("#projectIdInput").value = project?.id || "";
  $("#projectNameInput").value = "";
  $("#projectStreetInput").value = "";
  $("#projectZipInput").value = "";
  $("#projectCityInput").value = "";
  $("#projectCountryInput").value = "Deutschland";
  $("#projectClientInput").value = "";
  $("#projectContractorInput").value = state.settings.defaultCompany || "";
  $("#projectInspectorInput").value = "";
  $("#projectDefaultInspectorInput").value = defaultOwnPerson()?.name || state.settings.defaultInspector || "";
  $("#projectDropboxFolderInput").value = suggestProjectDropboxFolder({ name: $("#projectNameInput")?.value || "" });
  $("#projectDropboxLinkInput").value = "";
  $("#projectPlanFolderInput").value = state.settings.dropboxPlanFolder || "Pläne";
  $("#projectReportFolderInput").value = state.settings.dropboxReportFolder || "Berichte";
  $("#projectPhotoFolderInput").value = state.settings.dropboxPhotoFolder || "Fotos";
  $("#projectPlanDateInput").value = "";
  $("#projectNoteInput").value = "";
  if (project) {
    const address = normalizeAddress(project.address || project.siteAddress);
    $("#projectNameInput").value = project.name || "";
    $("#projectStreetInput").value = address.street || "";
    $("#projectZipInput").value = address.zip || "";
    $("#projectCityInput").value = address.city || "";
    $("#projectCountryInput").value = address.country || "Deutschland";
    $("#projectClientInput").value = displayCompanySnapshot(project.clientSnapshot, project.client);
    $("#projectContractorInput").value = displayCompanySnapshot(project.contractorSnapshot, project.contractor);
    $("#projectInspectorInput").value = displayInspectorSnapshot(project.inspectorSnapshot, project.inspector);
    $("#projectDefaultInspectorInput").value = displayOwnPersonSnapshot(project.defaultInspectorPersonSnapshot, project.defaultInspector);
    $("#projectDropboxFolderInput").value = project.dropboxFolder || suggestProjectDropboxFolder(project);
    $("#projectDropboxLinkInput").value = project.dropboxLink || "";
    $("#projectPlanFolderInput").value = project.planFolder || state.settings.dropboxPlanFolder || "Pläne";
    $("#projectReportFolderInput").value = project.reportFolder || state.settings.dropboxReportFolder || "Berichte";
    $("#projectPhotoFolderInput").value = project.photoFolder || state.settings.dropboxPhotoFolder || "Fotos";
    $("#projectPlanDateInput").value = project.planDate || "";
    $("#projectNoteInput").value = project.note || "";
  }
  $("#projectDialog").showModal();
}

function createProjectFromDialog() {
  const projectId = $("#projectIdInput").value;
  const existing = projectId ? projectById(projectId) : null;
  const name = $("#projectNameInput").value.trim();
  const address = normalizeAddress({
    street: $("#projectStreetInput").value.trim(),
    zip: $("#projectZipInput").value.trim(),
    city: $("#projectCityInput").value.trim(),
    country: $("#projectCountryInput").value.trim() || "Deutschland"
  });
  const clientSelection = projectPartySelection("client", $("#projectClientInput").value.trim(), existing);
  const contractorSelection = projectPartySelection("contractor", $("#projectContractorInput").value.trim(), existing);
  const inspectorSelection = projectPartySelection("inspector", $("#projectInspectorInput").value.trim(), existing);
  const defaultInspectorSelection = projectPartySelection("defaultInspector", $("#projectDefaultInspectorInput").value.trim(), existing);
  const project = normalizeProject({
    ...(existing || {}),
    name: name || "Unbenanntes Projekt",
    address,
    siteAddress: formatAddress(address),
    client: clientSelection.text,
    clientId: clientSelection.id,
    clientSnapshot: clientSelection.snapshot,
    contractor: contractorSelection.text,
    contractorId: contractorSelection.id,
    contractorSnapshot: contractorSelection.snapshot,
    inspector: inspectorSelection.text,
    inspectorId: inspectorSelection.id,
    inspectorSnapshot: inspectorSelection.snapshot,
    defaultInspector: defaultInspectorSelection.text,
    defaultInspectorPersonId: defaultInspectorSelection.id,
    defaultInspectorPersonSnapshot: defaultInspectorSelection.snapshot,
    planDate: $("#projectPlanDateInput").value.trim(),
    note: $("#projectNoteInput").value.trim(),
    dropboxFolder: $("#projectDropboxFolderInput")?.value.trim() || suggestProjectDropboxFolder({ name }),
    dropboxLink: $("#projectDropboxLinkInput")?.value.trim() || "",
    planFolder: $("#projectPlanFolderInput")?.value.trim() || state.settings.dropboxPlanFolder || "Pläne",
    reportFolder: $("#projectReportFolderInput")?.value.trim() || state.settings.dropboxReportFolder || "Berichte",
    photoFolder: $("#projectPhotoFolderInput")?.value.trim() || state.settings.dropboxPhotoFolder || "Fotos",
    updatedAt: new Date().toISOString()
  });
  if (existing) {
    Object.assign(existing, project);
  } else {
    state.projects.unshift(project);
  }
  state.currentProjectId = project.id;
  protocolsForProject(project.id).forEach((protocol) => syncProtocolProjectFields(protocol, project));
  persist();
  renderHomeProjects();
  renderList();
  $("#projectDialog").close();
  const returnView = state.projectDialogReturnView || "projectHubView";
  state.projectDialogReturnView = "";
  if (returnView === "projectPlansView") renderProjectPlansView();
  if (returnView === "projectHubView") renderProjectHub();
  if (returnView === "projectDirectoryView") renderProjectDirectory();
  if (returnView === "siteControlView") renderSiteControlView();
  showView(returnView === "editorView" ? "projectHubView" : returnView);
}

function projectPartySelection(kind, value, existingProject = null) {
  if (kind === "client" || kind === "contractor") {
    const company = resolveCompany(value);
    const oldSnapshot = kind === "client" ? existingProject?.clientSnapshot : existingProject?.contractorSnapshot;
    const oldText = kind === "client" ? existingProject?.client : existingProject?.contractor;
    if (!company && oldSnapshot && value === displayCompanySnapshot(oldSnapshot, oldText)) {
      return { text: oldSnapshot.name || oldText || value, id: oldSnapshot.id || "", snapshot: oldSnapshot };
    }
    return { text: company?.name || value, id: company?.id || "", snapshot: snapshotCompany(company) };
  }
  if (kind === "inspector") {
    const inspector = resolveInspector(value);
    if (!inspector && existingProject?.inspectorSnapshot && value === displayInspectorSnapshot(existingProject.inspectorSnapshot, existingProject.inspector)) {
      return { text: existingProject.inspectorSnapshot.name || existingProject.inspectorSnapshot.office || existingProject.inspector || value, id: existingProject.inspectorSnapshot.id || "", snapshot: existingProject.inspectorSnapshot };
    }
    return { text: inspector?.name || inspector?.office || value, id: inspector?.id || "", snapshot: snapshotInspector(inspector) };
  }
  const person = resolveOwnPerson(value);
  if (!person && existingProject?.defaultInspectorPersonSnapshot && value === displayOwnPersonSnapshot(existingProject.defaultInspectorPersonSnapshot, existingProject.defaultInspector)) {
    return { text: existingProject.defaultInspectorPersonSnapshot.name || existingProject.defaultInspector || value, id: existingProject.defaultInspectorPersonSnapshot.id || "", snapshot: existingProject.defaultInspectorPersonSnapshot };
  }
  return { text: person?.name || value, id: person?.id || "", snapshot: snapshotOwnPerson(person) };
}

function displayCompanySnapshot(snapshot, fallback = "") {
  if (!snapshot) return fallback || "";
  return companyLabel(snapshot) || snapshot.name || fallback || "";
}

function displayInspectorSnapshot(snapshot, fallback = "") {
  if (!snapshot) return fallback || "";
  return inspectorLabel(snapshot) || snapshot.name || snapshot.office || fallback || "";
}

function displayOwnPersonSnapshot(snapshot, fallback = "") {
  if (!snapshot) return fallback || "";
  return personLabel(snapshot) || snapshot.name || fallback || "";
}

function slugifyPathSegment(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u00e4/g, "ae").replace(/\u00f6/g, "oe").replace(/\u00fc/g, "ue").replace(/\u00df/g, "ss")
    .replace(/\u00c4/g, "Ae").replace(/\u00d6/g, "Oe").replace(/\u00dc/g, "Ue")
    .replace(/[^A-Za-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "") || "Projekt";
}

function joinDropboxPath(...parts) {
  const clean = parts.map((part) => String(part || "").trim()).filter(Boolean);
  if (!clean.length) return "";
  const joined = clean.map((part, index) => {
    let value = part.replace(/\\/g, "/");
    if (index > 0) value = value.replace(/^\/+/, "");
    if (index < clean.length - 1) value = value.replace(/\/+$/, "");
    return value;
  }).join("/").replace(/\/+/g, "/");
  return joined.startsWith("/") ? joined : `/${joined}`;
}

function suggestProjectDropboxFolder(project = {}) {
  const base = state.settings.dropboxBaseFolder || "";
  if (!base) return "";
  return joinDropboxPath(base, slugifyPathSegment(project.name || project.projectName || "Projekt")) + "/";
}

function normalizeDocumentStatus(value = "") {
  const text = String(value || "").trim();
  if (text === "ma" + String.fromCharCode(63) + "gebend") return "maßgebend";
  return text || "verwendet";
}

function ensureProjectPlanLibraryProtocol(projectId = state.currentProjectId) {
  const project = projectById(projectId);
  if (!project) return null;
  let protocol = protocolsForProject(projectId).find(isProjectPlanLibraryProtocol);
  if (protocol) return protocol;
  protocol = blankProtocol(project, {
    kind: PROTOCOL_KIND_PROJECT_PLANS,
    head: {
      acceptanceTitle: "Projektpläne",
      acceptanceType: "Planverwaltung",
      component: "Projektpläne"
    }
  });
  protocol.kind = PROTOCOL_KIND_PROJECT_PLANS;
  protocol.type = "initial";
  protocol.plans = [];
  protocol.pins = [];
  protocol.checkpoints = [];
  protocol.siteItems = [];
  protocol.dailyReport = {};
  protocol.result = { resultStatus: "nicht relevant", finalNote: "Zentrale Planablage", inspectorName: "", signatureText: "" };
  protocol.signatures = [];
  protocol.overviewPhotos = [];
  protocol.updatedAt = new Date().toISOString();
  state.protocols.push(protocol);
  return protocol;
}

function shouldHideProtocolInModuleLists(protocol = {}) {
  return isProjectPlanLibraryProtocol(protocol);
}


const PLAN_CATEGORIES = ["Bewehrungsplan", "Arbeitsplan", "Schalplan", "Baugesuch", "Sonstiges"];
const PLAN_FLOOR_OPTIONS = ["UG", "EG", "OG", "DG", "Dach", "Sonstiges"];
const PLAN_COMPONENT_OPTIONS = ["Bodenplatte", "Decke", "Wand", "Fundament", "Stütze", "Unterzug", "Treppe", "Gesamt", "Sonstiges"];
const APP_PLAN_NAME_SUGGESTIONS = [
  "Bewehrung Bodenplatte untere Lage",
  "Bewehrung Bodenplatte obere Lage",
  "Bewehrung Decke über UG",
  "Bewehrung Wand",
  "Schalplan Bodenplatte UG",
  "Schalplan Decke über UG",
  "Arbeitsplan UG",
  "Arbeitsplan EG",
  "Baugesuch Grundriss",
  "Baugesuch Schnitt",
  "Sonstiges"
];

function cleanPlanTitleFromFileName(fileName = "") {
  return String(fileName || "")
    .replace(/\.[^.]+$/, "")
    .replace(/[_]+/g, " ")
    .replace(/[-–—]+/g, " ")
    .replace(/\b(plan|bewehrungsplan|schalplan)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferPlanCategory(plan = {}) {
  const source = [plan.category, plan.planCategory, plan.fileName, plan.dropboxFileName, plan.title, plan.appPlanName, plan.planNumber].join(" ").toLowerCase();
  if (/arbeitsplan/.test(source)) return "Arbeitsplan";
  if (/schalplan|\bs[-\s]?\d{2,4}/i.test(source)) return "Schalplan";
  if (/baugesuch/.test(source)) return "Baugesuch";
  if (/bewehr|\bb[-\s]?\d{2,4}/i.test(source)) return "Bewehrungsplan";
  return "Sonstiges";
}

function inferPlanFloor(plan = {}) {
  const source = [plan.floor, plan.fileName, plan.title, plan.appPlanName].join(" ").toLowerCase();
  if (/\bug\b|untergeschoss|tiefgarage/.test(source)) return "UG";
  if (/\beg\b|erdgeschoss/.test(source)) return "EG";
  if (/\bdg\b|dachgeschoss|dach/.test(source)) return "DG";
  if (/\bog\b|obergeschoss/.test(source)) return "OG";
  return plan.floor || "";
}

function inferPlanComponent(plan = {}) {
  const source = [plan.component, plan.fileName, plan.title, plan.appPlanName].join(" ").toLowerCase();
  if (/bodenplatte/.test(source)) return "Bodenplatte";
  if (/decke/.test(source)) return "Decke";
  if (/wand/.test(source)) return "Wand";
  if (/fundament/.test(source)) return "Fundament";
  if (/stütze|stuetze/.test(source)) return "Stütze";
  if (/unterzug/.test(source)) return "Unterzug";
  if (/treppe/.test(source)) return "Treppe";
  if (/gesamt/.test(source)) return "Gesamt";
  return plan.component || "";
}

function planPrimaryNumber(plan = {}) {
  return safePlanNumberCandidate(plan.planNumber || plan.planNo || plan.plan_number || "") || plan.planNumber || plan.planNo || "";
}

function planAppName(plan = {}) {
  return plan.appPlanName || plan.displayName || plan.plan_title_app || plan.title || cleanPlanTitleFromFileName(plan.fileName || plan.dropboxFileName || "") || "Plan";
}

function planCompactTitle(plan = {}) {
  const number = planPrimaryNumber(plan) || `Plan ${plan.number || ""}`.trim() || "ohne Plan-Nr.";
  const name = planAppName(plan);
  return `${number} · ${name}`;
}

function planMetaLine(plan = {}) {
  return [
    plan.category || "Sonstiges",
    plan.floor || "ohne Geschoss",
    plan.component || "ohne Bauteil",
    plan.planDate ? `Stand ${plan.planDate}` : "ohne Stand",
    plan.planIndex ? `Index ${plan.planIndex}` : "ohne Index"
  ].filter(Boolean).join(" · ");
}

function normalizePlanMeta(plan = {}) {
  plan.source = plan.source || (plan.dropboxPath || plan.dropboxSharedLink ? "dropbox_path" : "uploaded");
  plan.documentStatus = normalizeDocumentStatus(plan.documentStatus || "verwendet");
  plan.planNumber = planPrimaryNumber(plan);
  plan.planNo = plan.planNo || plan.planNumber || "";
  plan.appPlanName = planAppName(plan);
  plan.title = plan.title || plan.appPlanName || "";
  plan.category = plan.category || plan.plan_category || inferPlanCategory(plan);
  plan.floor = plan.floor || inferPlanFloor(plan);
  plan.component = plan.component || inferPlanComponent(plan);
  plan.dropboxPath = plan.dropboxPath || "";
  plan.dropboxSharedLink = plan.dropboxSharedLink || plan.dropboxLink || "";
  plan.dropboxFileName = plan.dropboxFileName || "";
  plan.dropboxFileId = plan.dropboxFileId || "";
  plan.dropboxRev = plan.dropboxRev || "";
  plan.lastSyncedAt = plan.lastSyncedAt || "";
  plan.lastManualSync = plan.lastManualSync || "";
  plan.syncStatus = plan.syncStatus || (plan.source === "uploaded" ? "not_configured" : "linked");
  return plan;
}

function planSourceLabel(plan = {}) {
  const source = plan.source || (plan.dropboxPath || plan.dropboxSharedLink ? "dropbox_path" : "uploaded");
  if (source === "dropbox_link") return "Dropbox-Link";
  if (source === "dropbox_path") return "Dropbox-Pfad";
  return "hochgeladen";
}

function projectPlanDedupeKey(plan = {}, projectId = "") {
  const normalized = normalizePlanMeta(plan);
  const parts = [
    normalized.planNumber,
    normalized.appPlanName || normalized.title || normalized.name,
    normalized.fileName || normalized.dropboxFileName,
    normalized.pageCount,
    projectId
  ].map((value) => String(value || "").trim().toLowerCase());
  return parts.some(Boolean) ? parts.join("|") : normalized.id || uid("plan-key");
}

function projectPlanEntries(projectId = state.currentProjectId) {
  const seen = new Set();
  const entries = [];
  protocolsForProject(projectId).forEach((protocol) => {
    (protocol.plans || []).forEach((sourcePlan) => {
      const plan = normalizePlanMeta(sourcePlan);
      const idKey = plan.id ? `id:${plan.id}` : "";
      const metaKey = `meta:${projectPlanDedupeKey(plan, projectId)}`;
      if ((idKey && seen.has(idKey)) || seen.has(metaKey)) return;
      if (idKey) seen.add(idKey);
      seen.add(metaKey);
      entries.push({ protocol, plan });
    });
  });
  return entries;
}

function syncStatusLabel(status = "") {
  return ({
    not_configured: "Nicht eingerichtet",
    linked: "Verknüpft",
    needs_sync: "Abgleich erforderlich",
    synced: "Synchron",
    error: "Fehler"
  })[status] || "Nicht eingerichtet";
}

function validDropboxLink(plan = {}) {
  const link = String(plan.dropboxSharedLink || plan.dropboxLink || "").trim();
  return /^https:\/\//i.test(link) ? link : "";
}

function projectPlanPreview(plan = {}) {
  const number = planPrimaryNumber(plan) || "Plan";
  const file = plan.fileName || plan.dropboxFileName || "Datei";
  const type = plan.type === "application/pdf" ? `${plan.pageCount || "?"} PDF-Seite(n)` : "Bildplan";
  return `
    <div class="project-plan-preview" aria-label="Planvorschau Platzhalter">
      <span>${escapeHtml(number)}</span>
      <small>${escapeHtml(plan.category || type)}</small>
      <small>${escapeHtml(file)}</small>
    </div>`;
}

function markPlansForCurrentContext() {
  if (!state.current) return [];
  const projectPlans = projectPlanEntries(state.current.projectId).map(({ plan }) => normalizePlanMeta(plan));
  const localPlans = Array.isArray(state.current.plans) ? state.current.plans.map(normalizePlanMeta) : [];
  const seen = new Set();
  return [...localPlans, ...projectPlans].filter((plan) => {
    const key = plan.id || projectPlanDedupeKey(plan, state.current.projectId);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function annotatePlanContext(plan, context = {}) {
  if (!plan) return null;
  Object.defineProperty(plan, "_planContext", {
    value: context,
    configurable: true,
    enumerable: false
  });
  return plan;
}

function planContext(plan) {
  if (!plan) return { scope: "none" };
  if (plan._planContext) return plan._planContext;
  const isLocal = !!state.current?.plans?.some((item) => item.id === plan.id);
  return { scope: isLocal ? "protocol" : "project" };
}

function isProjectPlan(plan) {
  return planContext(plan).scope === "project";
}

function plansForCurrentProtocol() {
  if (!state.current) return [];
  const projectId = state.current.projectId || state.currentProjectId || "";
  const seen = new Set();
  const plans = [];
  const add = (sourcePlan, context) => {
    if (!sourcePlan) return;
    const plan = annotatePlanContext(normalizePlanMeta(sourcePlan), context);
    const key = plan.id || projectPlanDedupeKey(plan, projectId);
    if (seen.has(key)) return;
    seen.add(key);
    plans.push(plan);
  };
  (state.current.plans || []).forEach((plan) => add(plan, { scope: "protocol", protocolId: state.current.id }));
  projectPlanEntries(projectId).forEach(({ protocol, plan }) => {
    add(plan, {
      scope: protocol?.id === state.current.id ? "protocol" : "project",
      protocolId: protocol?.id || "",
      protocolTitle: acceptanceLabel(protocol)
    });
  });
  return plans;
}

function normalizeReportPlanValue(value = "") {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return [];
  const ascii = raw.normalize ? raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : raw;
  const compact = ascii.replace(/[^a-z0-9]/g, "");
  return [...new Set([raw, ascii, compact].filter(Boolean))];
}

function reportPlanIdentityValues(plan = {}) {
  const fields = [plan.id, plan.planId, plan.plan_id, plan.planNumber, plan.planNo, plan.plan_number, plan.appPlanName, plan.displayName, plan.planName, plan.plan_title_app, plan.title, plan.name, plan.fileName, plan.filename, plan.dropboxFileName];
  return [...new Set(fields.flatMap(normalizeReportPlanValue))];
}

function reportPlanMatches(plan = {}, reference = {}) {
  const planValues = new Set(reportPlanIdentityValues(plan));
  if (!planValues.size) return false;
  return reportPlanIdentityValues(reference).some((value) => planValues.has(value));
}

function reportPinPlacementReference(pin = {}, placement = {}) {
  return {
    id: placement.planId || pin.planId || "",
    planId: placement.planId || pin.planId || "",
    plan_id: placement.plan_id || pin.plan_id || "",
    planNumber: placement.planNumber || pin.planNumber || pin.planNo || "",
    planNo: placement.planNo || pin.planNo || "",
    plan_number: placement.plan_number || pin.plan_number || "",
    appPlanName: placement.appPlanName || placement.planName || pin.planName || "",
    title: placement.title || placement.planTitle || pin.planTitle || "",
    name: placement.name || "",
    fileName: placement.fileName || placement.filename || ""
  };
}

function findReportPlan(plans = [], reference = {}) {
  return (plans || []).find((plan) => reportPlanMatches(plan, reference)) || null;
}

function reportPlacementForPlan(pin = {}, planOrId = {}, pageNumber = null) {
  const exactId = typeof planOrId === "string" ? planOrId : "";
  const planRef = exactId ? { id: exactId, planId: exactId } : (planOrId || {});
  return pinPlacements(pin).find((placement) => {
    if (pageNumber && placement.pageNumber !== pageNumber) return false;
    if (exactId) return placement.planId === exactId;
    return reportPlanMatches(planRef, reportPinPlacementReference(pin, placement));
  }) || null;
}

function pinHasReportPlacement(pin = {}, planOrId = {}, pageNumber = null) {
  return !!reportPlacementForPlan(pin, planOrId, pageNumber);
}

function reportPlanPagesForProtocol(protocol = state.current, plan = {}) {
  const pages = [...new Set((protocol?.pins || []).flatMap((pin) =>
    pinPlacements(pin)
      .filter((placement) => reportPlanMatches(plan, reportPinPlacementReference(pin, placement)))
      .map((placement) => placement.pageNumber || 1)
  ))];
  return pages.length ? pages : [plan.currentPage || 1];
}

function reportPlansForProtocol(protocol = state.current) {
  if (!protocol) return [];
  const projectId = protocol.projectId || state.currentProjectId || state.current?.projectId || "";
  const seen = new Set();
  const plans = [];
  const add = (sourcePlan, context = {}) => {
    if (!sourcePlan) return null;
    const plan = annotatePlanContext(normalizePlanMeta(sourcePlan), context);
    const key = plan.id || projectPlanDedupeKey(plan, projectId);
    const existing = plans.find((item) => (plan.id && item.id === plan.id) || projectPlanDedupeKey(item, projectId) === key);
    if (seen.has(key) && existing) return existing;
    seen.add(key);
    plans.push(plan);
    return plan;
  };
  (protocol.plans || []).forEach((plan) => add(plan, { scope: "protocol", protocolId: protocol.id || "" }));
  projectPlanEntries(projectId).forEach(({ protocol: sourceProtocol, plan }) => {
    add(plan, { scope: sourceProtocol?.id === protocol.id ? "protocol" : "project", protocolId: sourceProtocol?.id || "", protocolTitle: acceptanceLabel(sourceProtocol) });
  });
  (protocol.pins || []).forEach((pin) => {
    pinPlacements(pin).forEach((placement) => {
      if (!placement.planId) return;
      const reference = reportPinPlacementReference(pin, placement);
      if (findReportPlan(plans, reference)) return;
      const resolved = protocol === state.current ? planById(placement.planId) : null;
      if (resolved) {
        add(resolved, { scope: "resolved", protocolId: protocol.id || "" });
        return;
      }
      const warning = `Plan zu ${pinLabel(pin)} konnte nicht aufgelöst werden. plan_id: ${placement.planId}, pin_id: ${pin.id}.`;
      add({ id: String(placement.planId), planId: String(placement.planId), planNumber: placement.planNumber || pin.planNumber || "", appPlanName: placement.planName || pin.planName || "Plan nicht aufgelöst", title: placement.planName || pin.planName || "Plan nicht aufgelöst", fileName: String(placement.planId), pageCount: placement.pageNumber || 1, currentPage: placement.pageNumber || 1, type: "missing", documentStatus: "verwendet", reportOnly: true, renderError: warning }, { scope: "missing", protocolId: protocol.id || "" });
    });
  });
  return plans;
}

function selectedPlanSourceText(plan) {
  if (!plan) return "";
  const context = planContext(plan);
  if (context.scope === "project") return "Projektplan" + (context.protocolTitle ? " aus " + context.protocolTitle : "");
  return "Abnahmeplan";
}

function currentPlanViewSettings(plan) {
  if (!state.current || !plan?.id) return { rotation: 0 };
  state.current.planViewSettings = state.current.planViewSettings || {};
  state.current.planViewSettings[plan.id] = state.current.planViewSettings[plan.id] || { rotation: 0 };
  return state.current.planViewSettings[plan.id];
}

function planRotation(plan = selectedPlan()) {
  const rotation = Number(currentPlanViewSettings(plan).rotation) || 0;
  return ((rotation % 360) + 360) % 360;
}

function setPlanRotation(delta) {
  const plan = selectedPlan();
  if (!plan) return;
  const settings = currentPlanViewSettings(plan);
  settings.rotation = ((Number(settings.rotation) || 0) + delta + 360) % 360;
  plan.panX = 0;
  plan.panY = 0;
  state.pinMode = false;
  state.placementModePinId = "";
  saveFromForm({ persistNow: false });
  renderPlan();
}

function siteControlPinForItem(item) {
  if (!item?.pinId || !state.current?.pins) return null;
  return state.current.pins.find((pin) => pin.id === item.pinId) || null;
}

function siteControlItemContext(item = {}) {
  return [item.type, item.location || item.trade].filter(Boolean).join(" \u00b7 ") || "Feststellung";
}

function siteControlPinStatus(status = "") {
  const value = String(status || "").toLowerCase();
  if (value.includes("erledigt")) return "OK";
  if (value.includes("kl\u00e4r") || value.includes("bearbeitung")) return "teilweise / Auflage";
  if (value.includes("offen") || value.includes("mangel")) return "nicht OK";
  return "offen / nicht bewertet";
}

function siteControlPlanReference(item = {}, pin = siteControlPinForItem(item)) {
  const planId = pin?.planId || item.planId || "";
  const plan = planById(planId);
  if (!pin && !planId && !item.planReference) return "";
  const page = pin?.pageNumber || item.pageNumber || 1;
  const label = pin ? pinLabel(pin) : "Pin";
  const planName = plan ? (plan.planNumber || plan.title || plan.fileName || "Plan") : (item.planReference || "Plan");
  return `${planName} \u00b7 Seite ${page} \u00b7 ${label}`;
}

function syncSiteControlItemPinReference(item, pin) {
  if (!item || !pin) return;
  item.pinId = pin.id;
  item.planId = pin.planId || "";
  item.pageNumber = Math.max(1, Number(pin.pageNumber) || 1);
  item.planReference = siteControlPlanReference(item, pin);
  if (pin.note && (!item.description || item.description === item.planReference)) item.description = pin.note;
  if (pin.title && !item.location) item.location = pin.title;
  item.photos = item.photos || [];
  (pin.photos || []).forEach((photo) => {
    if (!item.photos.some((entry) => entry.id === photo.id)) item.photos.push(photo);
  });
  item.updatedAt = new Date().toISOString();
}

function clearSiteControlItemPin(item) {
  if (!item) return;
  item.pinId = "";
  item.planId = "";
  item.pageNumber = 1;
  item.planReference = "";
  item.updatedAt = new Date().toISOString();
}


async function saveMasterDataFromProjectDialog() {
  const payload = normalizeMasterData({ ...state.masterData, lastSavedAt: new Date().toISOString() });
  await idbPutComplete("masterData", payload);
  state.masterData = normalizeMasterData(await idbGet("masterData", "app"));
  setMasterDataDirty(false);
  renderDatalists();
}

async function addProjectFieldToMaster(kind) {
  const master = normalizeMasterData(state.masterData);
  if (kind === "client" || kind === "contractor") {
    const input = kind === "client" ? $("#projectClientInput") : $("#projectContractorInput");
    const value = input.value.trim();
    if (!value) return alert("Bitte zuerst einen Namen eintragen.");
    const existing = resolveCompany(value);
    if (existing) return alert("Dieser Stammdatensatz ist bereits vorhanden.");
    const company = { id: uid("company"), name: value, role: kind === "client" ? "Auftraggeber" : "Ausführende Firma", contact: "", address: normalizeAddress(), phone: "", email: "", note: "" };
    master.companies.push(company);
    state.masterData = master;
    await saveMasterDataFromProjectDialog();
    input.value = companyLabel(company);
    return;
  }
  if (kind === "inspector") {
    const value = $("#projectInspectorInput").value.trim();
    if (!value) return alert("Bitte zuerst einen Namen oder Sachbearbeiter eintragen.");
    if (resolveInspector(value)) return alert("Dieser Stammdatensatz ist bereits vorhanden.");
    const inspector = { id: uid("inspector"), name: value, office: "", address: normalizeAddress(), email: "", phone: "", note: "" };
    master.inspectors.push(inspector);
    state.masterData = master;
    await saveMasterDataFromProjectDialog();
    $("#projectInspectorInput").value = inspectorLabel(inspector);
    return;
  }
  const value = $("#projectDefaultInspectorInput").value.trim();
  if (!value) return alert("Bitte zuerst einen Namen eintragen.");
  if (resolveOwnPerson(value)) return alert("Dieser Stammdatensatz ist bereits vorhanden.");
  const person = { id: uid("person"), name: value, company: "", role: "Abnehmender / Bewehrungskontrolle", address: normalizeAddress(), phone: "", email: "", isDefault: !master.ownPersons.length };
  master.ownPersons.push(person);
  state.masterData = master;
  await saveMasterDataFromProjectDialog();
  $("#projectDefaultInspectorInput").value = personLabel(person);
}

function lookupSelection(key, value) {
  const text = String(value || "").trim();
  return {
    text,
    id: text,
    snapshot: text ? { id: text, value: text, label: text } : null
  };
}

async function saveLookupFromAcceptanceDialog(key, inputSelector, label) {
  const value = $(inputSelector).value.trim();
  if (!value) return alert(`Bitte zuerst ${label} eintragen.`);
  const master = normalizeMasterData(state.masterData);
  if ((master[key] || []).some((item) => item.toLowerCase() === value.toLowerCase())) {
    return alert("Dieser Stammdatenwert ist bereits vorhanden.");
  }
  master[key] = uniqueValues([...(master[key] || []), value]);
  state.masterData = master;
  await saveMasterDataFromProjectDialog();
  $(inputSelector).value = value;
}

async function refreshMasterDataFromDb() {
  state.masterData = normalizeMasterData(await idbGet("masterData", "app"));
  renderDatalists();
}

async function openAcceptanceDialog(projectId) {
  const project = projectById(projectId);
  if (!project) return;
  await refreshMasterDataFromDb();
  state.pendingAcceptanceProjectId = project.id;
  state.currentProjectId = project.id;
  state.acceptanceDialogReturnFocus = document.activeElement;
  $("#acceptanceTitleInput").value = "";
  const typeInput = $("#acceptanceTypeInput");
  typeInput.value = (state.masterData?.acceptanceTypes || DEFAULT_MASTER_DATA.acceptanceTypes).includes("Erstabnahme") ? "Erstabnahme" : (state.masterData?.acceptanceTypes?.[0] || "Erstabnahme");
  $("#acceptanceComponentInput").value = "";
  $("#acceptanceFloorInput").value = "";
  $("#acceptanceAreaInput").value = "";
  $("#acceptanceContractorInput").value = project.contractor || state.settings.defaultCompany || "";
  $("#acceptanceInspectorInput").value = project.defaultInspector || defaultOwnPerson()?.name || state.settings.defaultInspector || "";
  const sourceSelect = $("#acceptancePlanSourceInput");
  const acceptances = rebarProtocolsForProject(project.id);
  sourceSelect.innerHTML = `<option value="">Keine Planunterlagen übernehmen</option>${acceptances.map((protocol) => `<option value="${protocol.id}">${escapeHtml(protocol.head.acceptanceTitle || protocol.head.component || formatDate(protocol.head.createdAt))}</option>`).join("")}`;
  $("#acceptanceDialog").showModal();
}

function closeAcceptanceDialog() {
  const dialog = $("#acceptanceDialog");
  state.pendingAcceptanceProjectId = "";
  if (dialog?.open) dialog.close("cancel");
  const returnFocus = state.acceptanceDialogReturnFocus;
  state.acceptanceDialogReturnFocus = null;
  if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
}

async function createProtocolFromDialog() {
  const projectId = state.pendingAcceptanceProjectId;
  if (!projectId) return;
  const dialog = $("#acceptanceDialog");
  const confirmButton = $("#createAcceptanceConfirmBtn");
  confirmButton.disabled = true;
  try {
    const contractor = companySelection($("#acceptanceContractorInput").value);
    const inspector = ownPersonSelection($("#acceptanceInspectorInput").value);
    await createProtocol(projectId, {
      head: {
        acceptanceTitle: $("#acceptanceTitleInput").value.trim(),
        acceptanceType: $("#acceptanceTypeInput").value.trim() || "Erstabnahme",
        acceptanceTypeId: lookupSelection("acceptanceTypes", $("#acceptanceTypeInput").value).id,
        acceptanceTypeSnapshot: lookupSelection("acceptanceTypes", $("#acceptanceTypeInput").value).snapshot,
        component: $("#acceptanceComponentInput").value.trim(),
        componentId: lookupSelection("components", $("#acceptanceComponentInput").value).id,
        componentSnapshot: lookupSelection("components", $("#acceptanceComponentInput").value).snapshot,
        floor: $("#acceptanceFloorInput").value.trim(),
        floorId: lookupSelection("floors", $("#acceptanceFloorInput").value).id,
        floorSnapshot: lookupSelection("floors", $("#acceptanceFloorInput").value).snapshot,
        areaAxes: $("#acceptanceAreaInput").value.trim(),
        contractor: contractor.text,
        contractorId: contractor.id,
        contractorSnapshot: contractor.snapshot,
        inspectorName: inspector.text,
        inspectorPersonId: inspector.id,
        inspectorPersonSnapshot: inspector.snapshot
      },
      planSourceId: $("#acceptancePlanSourceInput").value
    });
    state.pendingAcceptanceProjectId = "";
    state.acceptanceDialogReturnFocus = null;
    if (dialog?.open) dialog.close("created");
  } finally {
    confirmButton.disabled = false;
  }
}

async function createProtocol(projectId = state.currentProjectId, options = {}) {
  let project = projectById(projectId);
  if (!project) {
    alert("Bitte zuerst ein Projekt öffnen. Abnahmen können nur innerhalb eines Projekts angelegt werden.");
    return;
  }
  const protocol = blankProtocol(project, { head: options.head || {} });
  if (options.planSourceId) {
    const source = state.protocols.find((item) => item.id === options.planSourceId);
    if (source) protocol.plans = await duplicatePlanRecords(source, protocol);
    protocol.activePlanId = protocol.plans[0]?.id || "";
  }
  state.protocols.unshift(protocol);
  state.currentProjectId = project.id;
  await persist();
  openProtocol(protocol);
}

function saveFromForm({ persistNow = true } = {}) {
  if (!state.current) return;
  const form = $("#protocolForm");
  const data = new FormData(form);
  Object.keys(state.current.head).forEach((key) => {
    if (["acceptanceTypeId", "acceptanceTypeSnapshot", "componentId", "componentSnapshot", "floorId", "floorSnapshot", "contractorId", "contractorSnapshot", "inspectorPersonId", "inspectorPersonSnapshot"].includes(key)) return;
    state.current.head[key] = data.get(key) || "";
  });
  syncAcceptanceLookupFieldsFromHead(state.current.head);
  Object.keys(state.current.weather).forEach((key) => state.current.weather[key] = data.get(key) || "");
  Object.keys(state.current.result).forEach((key) => state.current.result[key] = data.get(key) || "");
  syncResultLookupFields(state.current);
  const siteAddress = normalizeAddress({
    street: state.current.head.siteStreet,
    zip: state.current.head.siteZip,
    city: state.current.head.siteCity,
    country: state.current.head.siteCountry || "Deutschland"
  });
  state.current.head.siteStreet = siteAddress.street;
  state.current.head.siteZip = siteAddress.zip;
  state.current.head.siteCity = siteAddress.city;
  state.current.head.siteCountry = siteAddress.country;
  state.current.head.siteAddress = formatAddress(siteAddress);
  const project = projectById(state.current.projectId);
  if (project) {
    project.name = state.current.head.projectName || project.name;
    project.address = siteAddress;
    project.siteAddress = formatAddress(siteAddress);
    project.updatedAt = new Date().toISOString();
    protocolsForProject(project.id).forEach((protocol) => {
      if (protocol.id !== state.current.id) syncProtocolProjectFields(protocol, project);
    });
  }
  state.current.activePlanId = state.selectedPlanId;
  state.current.updatedAt = new Date().toISOString();
  if (persistNow) persist();
  else schedulePersist();
}

function syncAcceptanceLookupFieldsFromHead(head) {
  const type = lookupSelection("acceptanceTypes", head.acceptanceType || "Erstabnahme");
  const component = lookupSelection("components", head.component || "");
  const floor = lookupSelection("floors", head.floor || "");
  const contractor = companySelection(head.contractor || "");
  head.acceptanceType = type.text || "Erstabnahme";
  head.acceptanceTypeId = type.id;
  head.acceptanceTypeSnapshot = type.snapshot;
  head.component = component.text;
  head.componentId = component.id;
  head.componentSnapshot = component.snapshot;
  head.floor = floor.text;
  head.floorId = floor.id;
  head.floorSnapshot = floor.snapshot;
  head.contractor = contractor.text;
  head.contractorId = contractor.id;
  head.contractorSnapshot = contractor.snapshot;
}

function syncResultLookupFields(protocol) {
  const inspector = ownPersonSelection(protocol.result?.inspectorName || "");
  protocol.head.inspectorPersonId = inspector.id;
  protocol.head.inspectorPersonSnapshot = inspector.snapshot;
  if (inspector.text) protocol.result.inspectorName = inspector.text;
}

function fillForm() {
  const p = state.current;
  const project = projectById(p.projectId);
  const clientCompany = resolveCompany(project?.client || "");
  const contractorCompany = resolveCompany(p.head.contractor || project?.contractor || "");
  const projectInspector = resolveInspector(project?.inspector || "");
  const values = { ...p.head, ...p.weather, ...p.result };
  Object.entries(values).forEach(([key, value]) => {
    const field = $(`[name="${key}"]`);
    if (field) field.value = value || "";
  });
  renderFollowupContextBanner();
  renderOverviewPhotos();
  renderSignatures();
}

function renderFollowupContextBanner() {
  const banner = document.getElementById("followupContextBanner");
  if (!banner) return;
  if (!isFollowupProtocol(state.current)) {
    banner.hidden = true;
    banner.innerHTML = "";
    return;
  }
  banner.hidden = false;
  banner.innerHTML = `
    <strong>Nachbegehung / Nachkontrolle</strong>
    <span>Bezug: ${escapeHtml(followupSourceLabel(state.current))}</span>
  `;
}

function renderOverviewPhotos() {
  const summary = $("#photoBackupSummary");
  if (summary) summary.innerHTML = photoBackupSummaryHtml();
  const list = $("#overviewPhotoList");
  if (!list || !state.current) return;
  state.current.overviewPhotos = normalizeOverviewPhotos(state.current.overviewPhotos || [], state.current.id);
  const photos = state.current.overviewPhotos;
  if (!photos.length) {
    list.innerHTML = `<div class="overview-photo-empty"><p class="muted">Noch keine Übersichtsfotos zur Baustelle erfasst.</p></div>`;
    return;
  }
  list.innerHTML = photos.map((item, index) => `
    <article class="overview-photo-card" data-overview-photo-id="${item.id}">
      <div class="overview-photo-preview">
        <img data-photo-thumb="${item.photoId}" alt="${escapeAttr(item.caption || "Übersichtsfoto Baustelle")}">
        ${item.isCover ? `<span class="cover-badge">Titelbild</span>` : ""}
      </div>
      <div class="overview-photo-fields">
        <label>Bildbeschreibung / Kommentar
          <textarea data-overview-caption="${item.id}" rows="2" placeholder="z. B. Bodenplatte Übersicht">${escapeHtml(item.caption)}</textarea>
        </label>
        ${photoBackupActions({ ...item, id: item.photoId, name: item.caption || "Übersichtsfoto" })}
        <div class="overview-photo-tools">
          <button class="small-btn" type="button" data-overview-up="${item.id}" ${index === 0 ? "disabled" : ""}>Nach oben</button>
          <button class="small-btn" type="button" data-overview-down="${item.id}" ${index === photos.length - 1 ? "disabled" : ""}>Nach unten</button>
          <button class="small-btn" type="button" data-overview-cover="${item.id}">${item.isCover ? "Titelbild entfernen" : "Als Titelbild"}</button>
          <button class="danger-btn" type="button" data-overview-delete="${item.id}">Foto löschen</button>
        </div>
      </div>
    </article>
  `).join("");
  hydratePhotoThumbs(list);
}

function overviewPhotoById(id) {
  return state.current?.overviewPhotos?.find((item) => item.id === id) || null;
}

function reorderOverviewPhotos() {
  state.current.overviewPhotos = normalizeOverviewPhotos(state.current.overviewPhotos || [], state.current.id);
}

function moveOverviewPhoto(id, direction) {
  reorderOverviewPhotos();
  const photos = state.current?.overviewPhotos || [];
  const index = photos.findIndex((item) => item.id === id);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= photos.length) return;
  [photos[index], photos[nextIndex]] = [photos[nextIndex], photos[index]];
  photos.forEach((item, orderIndex) => {
    item.order = orderIndex + 1;
    item.updatedAt = new Date().toISOString();
  });
  persist();
  renderOverviewPhotos();
}

async function deleteOverviewPhoto(id) {
  const photo = overviewPhotoById(id);
  if (!photo) return;
  state.current.overviewPhotos = (state.current.overviewPhotos || []).filter((item) => item.id !== id);
  reorderOverviewPhotos();
  if (photo.photoId) await idbDelete("photos", photo.photoId);
  persist();
  renderOverviewPhotos();
}

function toggleOverviewCover(id) {
  const target = overviewPhotoById(id);
  if (!target) return;
  const nextValue = !target.isCover;
  (state.current.overviewPhotos || []).forEach((item) => {
    item.isCover = nextValue && item.id === id;
    item.updatedAt = new Date().toISOString();
  });
  persist();
  renderOverviewPhotos();
}

function renderSignatures() {
  const list = $("#signatureList");
  if (!list || !state.current) return;
  const signatures = state.current.signatures || [];
  if (!signatures.length) {
    list.innerHTML = `<div class="signature-card"><p class="muted">Noch keine digitale Unterschrift erfasst.</p></div>`;
    return;
  }
  list.innerHTML = signatures.map((signature) => signatureCard(signature)).join("");
  requestAnimationFrame(() => initSignaturePads(list));
}

function signatureCard(signature) {
  const isEditing = state.signatureEditId === signature.id;
  const hasSignature = !!signature.signatureData;
  return `
    <article class="signature-card" data-signature="${signature.id}">
      <div class="section-head">
        <h4>${escapeHtml(signature.name || "Neue Unterschrift")}</h4>
        <button class="danger-btn" type="button" data-delete-signature="${signature.id}">Eintrag löschen</button>
      </div>
      <div class="grid compact-grid">
        ${comboField({ label: "Name", field: "name", list: "personOptions", value: signature.name, placeholder: "Name" })}
        ${comboField({ label: "Firma", field: "company", list: "companyOptions", value: signature.company, placeholder: "Firma" })}
        ${comboField({ label: "Funktion / Rolle", field: "role", list: "signatureRoleOptions", value: signature.role, placeholder: "z. B. Polier" })}
        ${comboField({ label: "Unterschrift für", field: "category", list: "signatureCategoryOptions", value: signature.category, placeholder: "z. B. Verantwortlicher vor Ort" })}
        ${comboField({ label: "Datum / Uhrzeit", field: "signedAt", type: "datetime-local", value: signature.signedAt })}
        ${comboField({ label: "Bemerkung", field: "note", rows: 2, value: signature.note, placeholder: "optional" })}
      </div>
      <div class="signature-pad-wrap ${hasSignature ? "signed" : ""} ${isEditing ? "editing" : "locked"}">
        <canvas class="signature-pad" data-signature-pad="${signature.id}" aria-label="Unterschriftsfeld"></canvas>
        <div class="signature-placeholder">${isEditing ? "Unterschriftsmodus aktiv - bitte unterschreiben" : (hasSignature ? "" : "Noch keine Unterschrift")}</div>
        <div class="signature-line"></div>
      </div>
      <p class="muted signature-mode-hint">${isEditing ? "Unterschriftsmodus aktiv. Beim Zeichnen wird das Scrollen im Feld blockiert." : "Unterschriftsfeld ist gesperrt. Scrollen über dem Feld erzeugt keine Striche."}</p>
      <div class="result-actions">
        ${isEditing
          ? `<button class="primary-btn" type="button" data-save-signature="${signature.id}">Fertig</button>
             <button class="small-btn" type="button" data-reset-signature="${signature.id}">Zurücksetzen</button>`
          : `<button class="primary-btn" type="button" data-edit-signature="${signature.id}">${hasSignature ? "Unterschrift bearbeiten" : "Unterschreiben"}</button>
             ${hasSignature ? `<button class="small-btn" type="button" data-reset-signature="${signature.id}">Unterschrift löschen</button>` : ""}`}
      </div>
    </article>
  `;
}
function initSignaturePads(root = document) {
  $$("[data-signature-pad]", root).forEach((canvas) => initSignaturePad(canvas));
}

function initSignaturePad(canvas) {
  const id = canvas.dataset.signaturePad;
  const signature = findSignature(id);
  if (!signature || canvas.dataset.ready === "true") return;
  canvas.dataset.ready = "true";
  resizeSignatureCanvas(canvas, signature.signatureData);
  const ctx = canvas.getContext("2d");
  let drawing = false;
  let last = null;
  const drawTo = (event) => {
    if (!drawing) return;
    if (state.signatureEditId !== id) {
      drawing = false;
      return;
    }
    const point = signatureCanvasPoint(canvas, event);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    last = point;
    event.preventDefault();
  };
  canvas.addEventListener("pointerdown", (event) => {
    if (state.signatureEditId !== id) return;
    canvas.setPointerCapture(event.pointerId);
    canvas.closest(".signature-pad-wrap")?.classList.add("signed");
    drawing = true;
    last = signatureCanvasPoint(canvas, event);
    event.preventDefault();
  });
  canvas.addEventListener("pointermove", drawTo);
  const finish = (event) => {
    if (!drawing) return;
    if (state.signatureEditId !== id) {
      drawing = false;
      return;
    }
    drawing = false;
    signature.signatureData = canvas.toDataURL("image/png");
    signature.signedAt = signature.signedAt || nowLocalInput();
    persist();
    event.preventDefault();
  };
  canvas.addEventListener("pointerup", finish);
  canvas.addEventListener("pointercancel", finish);
}

function resizeSignatureCanvas(canvas, signatureData = "") {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(320, Math.floor(rect.width || canvas.parentElement?.clientWidth || 320));
  const height = Math.max(300, Math.floor(rect.height || 320));
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  if (signatureData) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, width, height);
    img.src = signatureData;
  }
}

function signatureCanvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function findSignature(id) {
  return state.current?.signatures.find((signature) => signature.id === id) || null;
}

function addSignature() {
  if (!state.current) return;
  saveFromForm();
  state.current.signatures.push(normalizeSignature({ signedAt: nowLocalInput() }));
  persist();
  renderSignatures();
}

function resetSignature(id) {
  const signature = findSignature(id);
  if (!signature) return;
  signature.signatureData = "";
  signature.signedAt = signature.signedAt || nowLocalInput();
  persist();
  renderSignatures();
}

function editSignature(id) {
  if (!findSignature(id)) return;
  state.signatureEditId = id;
  renderSignatures();
}

function saveSignature(id, event = null) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  const card = $(`[data-signature="${id}"]`);
  const signature = findSignature(id);
  if (!card || !signature) return;
  $$('[data-signature-field]', card).forEach((field) => {
    signature[field.dataset.signatureField] = field.value || "";
  });
  syncSignatureSnapshots(signature);
  const canvas = $(`[data-signature-pad="${id}"]`, card);
  const wasEditing = state.signatureEditId === id;
  if (canvas && wasEditing) signature.signatureData = canvas.toDataURL("image/png");
  signature.signedAt = signature.signedAt || nowLocalInput();
  state.signatureEditId = "";
  lockSignatureCardNow(card, canvas);
  persist();
  renderSignatures();
}

function lockSignatureCardNow(card, canvas = null) {
  const wrap = card?.querySelector?.(".signature-pad-wrap");
  if (wrap) {
    wrap.classList.remove("editing");
    wrap.classList.add("locked");
  }
  const pad = canvas || card?.querySelector?.(".signature-pad");
  if (pad) {
    pad.style.pointerEvents = "none";
    pad.style.touchAction = "auto";
  }
  const hint = card?.querySelector?.(".signature-mode-hint");
  if (hint) hint.textContent = "Unterschriftsfeld ist gesperrt. Scrollen über dem Feld erzeugt keine Striche.";
}
function syncSignatureSnapshots(signature) {
  const person = ownPersonSelection(signature.name || "");
  const company = companySelection(signature.company || person.snapshot?.company || "");
  signature.personId = person.id;
  signature.personSnapshot = person.snapshot;
  if (person.snapshot) {
    signature.name = person.snapshot.name || signature.name;
    signature.company = signature.company || person.snapshot.company || "";
    signature.role = signature.role || person.snapshot.role || "";
  }
  signature.companyId = company.id;
  signature.companySnapshot = company.snapshot;
  signature.roleSnapshot = signature.role ? { value: signature.role, label: signature.role } : null;
}

function applySignatureMasterSelection(signature, field, value) {
  signature[field] = value || "";
  if (field === "name") {
    const person = ownPersonSelection(value);
    signature.personId = person.id;
    signature.personSnapshot = person.snapshot;
    if (person.snapshot) {
      signature.name = person.snapshot.name || value;
      signature.company = signature.company || person.snapshot.company || "";
      signature.role = signature.role || person.snapshot.role || "";
    }
  }
  if (field === "company") {
    const company = companySelection(value);
    signature.company = company.text;
    signature.companyId = company.id;
    signature.companySnapshot = company.snapshot;
  }
  if (field === "role" || field === "category") {
    signature[`${field}Snapshot`] = value ? { value, label: value } : null;
  }
}

function deleteSignature(id) {
  if (!state.current) return;
  state.current.signatures = state.current.signatures.filter((signature) => signature.id !== id);
  persist();
  renderSignatures();
}



function selectedPlan() {
  if (!state.current) return null;
  const plans = plansForCurrentProtocol();
  let plan = plans.find((item) => item.id === state.selectedPlanId) || null;
  if (!plan && plans.length) {
    plan = plans[0];
    state.selectedPlanId = plan.id;
    state.current.activePlanId = plan.id;
  }
  return plan || null;
}

function acceptanceLabel(protocol) {
  return protocol?.head?.acceptanceTitle || protocol?.head?.component || formatDate(protocol?.head?.createdAt) || "Abnahme";
}



function projectStats(project) {
  const acceptances = rebarProtocolsForProject(project.id);
  const siteControls = siteControlProtocolsForProject(project.id);
  const dailyReports = dailyReportProtocolsForProject(project.id);
  const allProtocols = [...acceptances, ...siteControls, ...dailyReports];
  const latest = allProtocols.reduce((value, protocol) => {
    const stamp = protocol.updatedAt || protocol.createdAt || protocol.head?.createdAt || "";
    return stamp > value ? stamp : value;
  }, project.updatedAt || project.createdAt || "");
  const openRebar = acceptances.reduce((sum, protocol) => sum + sampleIssues(protocol).length, 0);
  const openSite = siteControls.reduce((sum, protocol) => sum + (protocol.siteItems || []).filter(siteControlItemIsOpen).length, 0);
  return { acceptances, siteControls, dailyReports, latest, openPoints: openRebar + openSite };
}
function renderDatalists() {
  const master = normalizeMasterData(state.masterData);
  state.masterData = master;
  setDatalist("companyOptions", companyNames());
  setDatalist("clientOptions", clientNames());
  setDatalist("ownPersonOptions", ownPersonNames());
  setDatalist("personOptions", personNames());
  setDatalist("responsibleOptions", uniqueValues([...companyNames(), ...personNames(), ...ownPersonNames()]));
  setDatalist("inspectorOptions", master.inspectors.map(inspectorLabel));
  setDatalist("componentOptions", master.components);
  setDatalist("floorOptions", master.floors);
  setDatalist("acceptanceTypeOptions", master.acceptanceTypes);
  setDatalist("areaOptions", master.areaAxes);
  setDatalist("tradeRoleOptions", tradeRoleOptions());
  setDatalist("signatureCategoryOptions", signatureCategoryOptions());
  setDatalist("tradeOptions", state.masterData.trades || SITE_CONTROL_TRADES);
  const roleList = $("#signatureRoleOptions");
  if (roleList) roleList.innerHTML = master.signatureRoles.map((value) => `<option value="${escapeAttr(value)}"></option>`).join("");
}

function tradeRoleOptions() {
  const master = normalizeMasterData(state.masterData);
  return uniqueValues([
    ...master.signatureRoles,
    ...master.companies.map((company) => company.role || ""),
    "Rohbau",
    "Bewehrung",
    "Schalung",
    "Bauleitung",
    "Prüfung",
    "Kenntnisnahme vor Ort"
  ].filter(Boolean));
}

function signatureCategoryOptions() {
  return uniqueValues([
    "Verantwortlicher vor Ort",
    "Abnehmender / Bewehrungskontrolle",
    "Prüfer / Abnehmender",
    "Prüfingenieur",
    "Ausführende Firma",
    "Bauherr",
    "Kenntnisnahme vor Ort",
    "Sonstige"
  ]);
}

function setDatalist(id, values) {
  const list = $(`#${id}`);
  if (!list) return;
  list.innerHTML = uniqueValues(values).map((value) => `<option value="${escapeAttr(value)}"></option>`).join("");
}

function comboField({ label, field, value = "", list = "", placeholder = "", type = "text", rows = 0, className = "", extra = "", dataAttr = "data-signature-field" }) {
  const listAttr = list ? ` list="${escapeAttr(list)}"` : "";
  const fieldAttr = field ? ` ${escapeAttr(dataAttr)}="${escapeAttr(field)}"` : "";
  const placeholderAttr = placeholder ? ` placeholder="${escapeAttr(placeholder)}"` : "";
  const input = rows
    ? `<textarea${fieldAttr} rows="${rows}"${placeholderAttr}>${escapeHtml(value)}</textarea>`
    : `<input${fieldAttr} type="${escapeAttr(type)}"${listAttr} value="${escapeAttr(value)}"${placeholderAttr}>`;
  return `<label class="${escapeAttr(className)}">${escapeHtml(label)}${input}${extra}</label>`;
}


const MASTER_DATA_SECTIONS = [
  { id: "companies", code: "FI", title: "Firmen", description: "Auftraggeber, ausf\u00fchrende Firmen, Nachunternehmer" },
  { id: "persons", code: "PE", title: "Personen / Ansprechpartner", description: "Bauleiter, Ansprechpartner, Pr\u00fcfer, Kontakte" },
  { id: "trades", code: "GW", title: "Gewerke", description: "Rohbau, Elektro, Heizung, Fassade usw." },
  { id: "roles", code: "RO", title: "Rollen / Funktionen", description: "Auftraggeber, Bauherr, Pr\u00fcfer, Bauleiter, Zust\u00e4ndiger" },
  { id: "inspectors", code: "PI", title: "Pr\u00fcfer / Pr\u00fcfingenieure", description: "Pr\u00fcfingenieure, Sachbearbeiter, Pr\u00fcfb\u00fcros" },
  { id: "defaults", code: "ST", title: "Standardwerte", description: "Fristen, Priorit\u00e4ten, Status, Feststellungstypen" },
  { id: "standardTexts", code: "TX", title: "Standardtexte", description: "Textbausteine f\u00fcr M\u00e4ngel, Aufgaben, Hinweise und Schlussbemerkungen" },
  { id: "planStorage", code: "PL", title: "Planablage / Dropbox", description: "Dropbox-Basisordner, Planordner, Fotoordner, Berichtordner" }
];

function masterDataSectionMeta(sectionId) {
  return MASTER_DATA_SECTIONS.find((section) => section.id === sectionId) || null;
}

function renderMasterData() {
  const panel = $("#masterDataPanel");
  if (!panel) return;
  const master = normalizeMasterData(state.masterData);
  state.masterData = master;
  updateMasterDataSaveStatus();
  panel.innerHTML = state.masterDataSection
    ? renderMasterDataDetail(state.masterDataSection, master)
    : renderMasterDataOverview(master);
}

function renderMasterDataOverview(master) {
  return `
    <section class="panel master-overview">
      <div class="master-overview-head">
        <div>
          <h3>Stammdaten</h3>
          <p class="muted">Zentrale Daten f\u00fcr Projekte, Firmen, Personen und Module.</p>
        </div>
      </div>
      <div class="master-menu-grid">
        ${MASTER_DATA_SECTIONS.map((section) => `
          <button class="master-menu-card" type="button" data-master-section="${section.id}">
            <span class="master-menu-code">${escapeHtml(section.code)}</span>
            <span>
              <strong>${escapeHtml(section.title)}</strong>
              <small>${escapeHtml(section.description)}</small>
              <em>${escapeHtml(masterDataSectionSummary(section.id, master))}</em>
            </span>
          </button>
        `).join("")}
        <button class="master-menu-card master-menu-card-secondary" type="button" data-nav="homeView">
          <span class="master-menu-code">&larr;</span>
          <span>
            <strong>Zur\u00fcck zur BauSuite</strong>
            <small>Startseite und Module \u00f6ffnen</small>
          </span>
        </button>
      </div>
    </section>
  `;
}

function masterDataSectionSummary(sectionId, master) {
  if (sectionId === "companies") return `${master.companies.length} Eintrag${master.companies.length === 1 ? "" : "e"}`;
  if (sectionId === "persons") return `${master.ownPersons.length} Eintrag${master.ownPersons.length === 1 ? "" : "e"}`;
  if (sectionId === "inspectors") return `${master.inspectors.length} Eintrag${master.inspectors.length === 1 ? "" : "e"}`;
  if (sectionId === "trades") return `${master.components.length} Bauteilwerte`;
  if (sectionId === "roles") return `${master.signatureRoles.length} Rollen`;
  if (sectionId === "defaults") return `${master.acceptanceTypes.length + master.floors.length + master.areaAxes.length} Standardwerte`;
  if (sectionId === "planStorage") return state.settings?.dropboxBaseFolder ? "Basisordner gesetzt" : "Noch nicht eingerichtet";
  return "Vorbereitet";
}

function renderMasterDataDetail(sectionId, master) {
  const meta = masterDataSectionMeta(sectionId);
  const body = renderMasterDataSectionBody(sectionId, master);
  return `
    <section class="panel master-detail-head">
      <button class="secondary-btn" type="button" data-master-overview>Zur\u00fcck zur \u00dcbersicht</button>
      <div>
        <h3>${escapeHtml(meta?.title || "Stammdaten")}</h3>
        <p class="muted">${escapeHtml(meta?.description || "Stammdaten bearbeiten")}</p>
      </div>
    </section>
    ${body}
  `;
}

function renderMasterDataSectionBody(sectionId, master) {
  if (sectionId === "companies") {
    return masterSection("Firmen", "companies", master.companies, companyMasterFields());
  }
  if (sectionId === "persons") {
    return masterSection("Personen / Ansprechpartner", "ownPersons", master.ownPersons, personMasterFields());
  }
  if (sectionId === "inspectors") {
    return masterSection("Pr\u00fcfer / Pr\u00fcfingenieure", "inspectors", master.inspectors, inspectorMasterFields());
  }
  if (sectionId === "trades") {
    return `
      ${lookupMasterSection("Standard-Bauteile / Gewerke", "components", master.components)}
      <section class="panel master-info-card"><p class="muted">Diese Werte werden f\u00fcr Bauteile, Gewerke und wiederkehrende Auswahlfelder genutzt.</p></section>
    `;
  }
  if (sectionId === "roles") {
    return lookupMasterSection("Rollen / Funktionen", "signatureRoles", master.signatureRoles);
  }
  if (sectionId === "defaults") {
    return `
      ${lookupMasterSection("Standard-Abnahmearten", "acceptanceTypes", master.acceptanceTypes)}
      ${lookupMasterSection("Standard-Geschosse", "floors", master.floors)}
      ${lookupMasterSection("Standard-Bereiche / Achsen", "areaAxes", master.areaAxes)}
    `;
  }
  if (sectionId === "standardTexts") {
    return `
      <section class="panel master-section master-info-card">
        <h3>Standardtexte</h3>
        <p>Textbausteine f\u00fcr M\u00e4ngel, Aufgaben, Hinweise und Schlussbemerkungen sind als BauSuite-Erweiterung vorbereitet.</p>
        <p class="muted">Bestehende Berichtstexte und Pr\u00fcfpunkt-Bemerkungen bleiben unver\u00e4ndert. Es wird hier bewusst keine neue Datenstruktur erzwungen.</p>
      </section>
    `;
  }
  if (sectionId === "planStorage") {
    return renderPlanStorageMasterDataSection();
  }
  return `<section class="panel master-section"><p class="muted">Dieser Stammdatenbereich ist vorbereitet.</p></section>`;
}

function renderPlanStorageMasterDataSection() {
  return `
    <section class="panel master-section">
      <div class="section-head">
        <h3>Planablage / Dropbox</h3>
      </div>
      <p class="muted">Die App speichert Pl\u00e4ne und Fotos lokal auf diesem Ger\u00e4t. Diese Pfade dienen als strukturierte Ablagehinweise f\u00fcr Dropbox, Planordner und Berichtordner.</p>
      <div class="grid compact-grid">
        ${masterSettingInput("dropboxBaseFolder", "Dropbox-Basisordner", "z. B. /Kai BauSuite/Projekte")}
        ${masterSettingInput("dropboxPlanFolder", "Planordner", "Pl\u00e4ne")}
        ${masterSettingInput("dropboxPhotoFolder", "Fotoordner", "Fotos")}
        ${masterSettingInput("dropboxReportFolder", "Berichtordner", "Berichte")}
      </div>
      <p class="field-hint">Dropbox wird vorbereitet. Aktuell werden keine Dateien automatisch synchronisiert oder aus Dropbox geladen.</p>
    </section>
  `;
}

function masterSettingInput(key, label, placeholder = "") {
  return `<label>${escapeHtml(label)}<input data-master-setting="${escapeAttr(key)}" value="${escapeAttr(state.settings?.[key] || "")}" placeholder="${escapeAttr(placeholder)}"></label>`;
}

function masterSection(title, collection, items, fields) {
  const addLabel = collection === "companies" ? "Neue Firma" : "Neu";
  return `
    <section class="panel master-section">
      <div class="section-head">
        <h3>${escapeHtml(title)}</h3>
        <button class="secondary-btn" type="button" data-add-master="${collection}">${addLabel}</button>
      </div>
      <div class="master-items ${collection === "companies" ? "master-items-compact" : ""}">
        ${items.length ? items.map((item) => masterItemCard(collection, item, fields)).join("") : `<p class="muted">Noch keine Einträge.</p>`}
      </div>
    </section>
  `;
}

function masterItemSummary(collection, item) {
  if (collection === "companies") {
    const city = addressCity(item.address);
    return [item.name || "Neue Firma", city, item.role].filter(Boolean).join(" · ");
  }
  if (collection === "inspectors") return [item.name || "Neuer Prüfer", item.office].filter(Boolean).join(" · ");
  return [item.name || "Neuer Eintrag", item.company || item.role].filter(Boolean).join(" · ");
}

function masterItemCard(collection, item, fields) {
  const body = `
      <div class="grid compact-grid">
        ${fields.map((field) => masterInput(collection, item, field)).join("")}
      </div>
      <button class="danger-btn" type="button" data-delete-master="${collection}" data-master-id="${item.id}">Löschen</button>`;
  if (collection === "companies") {
    return `
      <details class="master-card master-card-collapsible" data-master-item="${collection}" data-master-id="${item.id}" ${item.name ? "" : "open"}>
        <summary><strong>${escapeHtml(masterItemSummary(collection, item))}</strong><small>${escapeHtml(item.contact || item.email || item.phone || "Details bearbeiten")}</small></summary>
        ${body}
      </details>
    `;
  }
  return `
    <article class="master-card" data-master-item="${collection}" data-master-id="${item.id}">
      ${body}
    </article>
  `;
}


function postalInputAttributes() {
  return 'type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="postal-code"';
}

function phoneInputAttributes() {
  return 'type="tel" inputmode="tel" autocomplete="tel"';
}

function inputAttributesForField(field = {}) {
  const name = field.name || "";
  if (name.endsWith(".zip") || name.toLowerCase().includes("zip") || name.toLowerCase().includes("postal")) return postalInputAttributes();
  if (name.toLowerCase().includes("phone") || name.toLowerCase().includes("telefon")) return phoneInputAttributes();
  return 'type="text"';
}

function cityInputForPostalInput(input) {
  if (!input) return null;
  if (input.id === "projectZipInput") return $("#projectCityInput");
  if (input.name === "siteZip") return input.form?.elements?.siteCity || null;
  if (input.dataset.masterField === "address.zip") return input.closest("[data-master-item]")?.querySelector('[data-master-field="address.city"]') || null;
  if (input.dataset.projectAddressZip !== undefined) return input.closest("form, dialog, .panel")?.querySelector("[data-project-address-city]") || null;
  return null;
}

function applyPostalCitySuggestion(input) {
  const zip = String(input?.value || "").trim();
  if (!/^\d{5}$/.test(zip)) return;
  const city = POSTAL_CITY_LOOKUP[zip];
  if (!city) return;
  const cityInput = cityInputForPostalInput(input);
  if (!cityInput) return;
  const previousSuggestion = cityInput.dataset.postalSuggestedCity || "";
  const canSet = !cityInput.value.trim() || cityInput.value === previousSuggestion;
  if (!canSet) return;
  cityInput.value = city;
  cityInput.dataset.postalSuggestedCity = city;
  cityInput.dispatchEvent(new Event("input", { bubbles: true }));
}

function masterInput(collection, item, field) {
  const value = getPath(item, field.name) || "";
  if (field.type === "checkbox") {
    return `<label>${escapeHtml(field.label)}<input data-master-field="${field.name}" type="checkbox" ${getPath(item, field.name) ? "checked" : ""}></label>`;
  }
  const zipWarning = field.name.endsWith(".zip") && value && !/^\d{5}$/.test(value)
    ? `<span class="field-warning">PLZ prüfen: deutsche PLZ normalerweise 5-stellig.</span>`
    : "";
  return `<label>${escapeHtml(field.label)}<input data-master-field="${field.name}" ${inputAttributesForField(field)} value="${escapeAttr(value)}" ${field.required ? "required" : ""} ${field.list ? `list="${field.list}"` : ""}>${zipWarning}</label>`;
}

function lookupMasterSection(title, key, values) {
  return `
    <section class="panel master-section">
      <div class="section-head">
        <h3>${escapeHtml(title)}</h3>
        <button class="secondary-btn" type="button" data-add-lookup="${key}">Neu</button>
      </div>
      <div class="lookup-list">
        ${values.map((value, index) => `
          <div class="lookup-row">
            <input data-lookup-key="${key}" data-lookup-index="${index}" value="${escapeAttr(value)}">
            <button class="danger-btn" type="button" data-delete-lookup="${key}" data-lookup-index="${index}">Löschen</button>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function personMasterFields() {
  return [
    { name: "name", label: "Name" },
    { name: "company", label: "Firma", list: "companyOptions" },
    { name: "role", label: "Funktion", list: "signatureRoleOptions" },
    { name: "address.street", label: "Straße / Hausnummer" },
    { name: "address.zip", label: "PLZ" },
    { name: "address.city", label: "Ort" },
    { name: "address.country", label: "Land" },
    { name: "phone", label: "Telefon" },
    { name: "email", label: "E-Mail" },
    { name: "isDefault", label: "Standard-Abnehmender", type: "checkbox" }
  ];
}

function companyMasterFields() {
  return [
    { name: "name", label: "Firmenname", required: true },
    { name: "role", label: "Gewerk / Rolle", list: "tradeRoleOptions" },
    { name: "contact", label: "Ansprechpartner" },
    { name: "address.street", label: "Straße / Hausnummer" },
    { name: "address.zip", label: "PLZ" },
    { name: "address.city", label: "Ort" },
    { name: "address.country", label: "Land" },
    { name: "phone", label: "Telefon" },
    { name: "email", label: "E-Mail" },
    { name: "note", label: "Bemerkung" }
  ];
}

function inspectorMasterFields() {
  return [
    { name: "name", label: "Name" },
    { name: "office", label: "Sachbearbeiter" },
    { name: "address.street", label: "Straße / Hausnummer" },
    { name: "address.zip", label: "PLZ" },
    { name: "address.city", label: "Ort" },
    { name: "address.country", label: "Land" },
    { name: "email", label: "E-Mail" },
    { name: "phone", label: "Telefon" },
    { name: "note", label: "Bemerkung" }
  ];
}

function addMasterItem(collection) {
  const master = normalizeMasterData(state.masterData);
  if (collection === "ownPersons") master.ownPersons.push({ id: uid("person"), name: "", company: "", role: "", address: normalizeAddress(), phone: "", email: "", isDefault: !master.ownPersons.length });
  if (collection === "companies") master.companies.unshift({ id: uid("company"), name: "", role: "", contact: "", address: normalizeAddress(), phone: "", email: "", note: "" });
  if (collection === "inspectors") master.inspectors.push({ id: uid("inspector"), name: "", office: "", address: normalizeAddress(), email: "", phone: "", note: "" });
  state.masterData = master;
  setMasterDataDirty(true);
  renderDatalists();
  renderMasterData();
}

function deleteMasterItem(collection, id) {
  const master = normalizeMasterData(state.masterData);
  master[collection] = (master[collection] || []).filter((item) => item.id !== id);
  state.masterData = master;
  setMasterDataDirty(true);
  renderDatalists();
  renderMasterData();
}

function addLookupValue(key) {
  const master = normalizeMasterData(state.masterData);
  master[key] = uniqueValues([...(master[key] || []), "Neu"]);
  state.masterData = master;
  setMasterDataDirty(true);
  renderDatalists();
  renderMasterData();
}





function acceptanceCard(p) {
  const issues = sampleIssues(p).length;
  return `
    <article class="acceptance-card">
      <div>
        <h4>${escapeHtml(p.head.acceptanceTitle || p.head.component || "Unbenannte Abnahme")}</h4>
        <div class="muted">${escapeHtml(formatDate(protocolInspectionDateTime(p)))} · ${escapeHtml(p.head.acceptanceType || "Erstabnahme")} · ${escapeHtml(p.head.component || "Bauteil offen")}</div>
        <div>${escapeHtml(p.head.areaAxes || p.head.floor || "")}</div>
        <div class="muted">${escapeHtml(p.result?.resultStatus || "Ergebnis offen")} · ${issues} Auflage(n)/Mangel · ${p.pins.length} Pin(s)</div>
        <div class="muted">Zuletzt bearbeitet: ${escapeHtml(formatDate(p.updatedAt || p.createdAt || p.head.createdAt))}</div>
      </div>
      <div class="card-actions">
        <button class="secondary-btn" data-open="${p.id}" type="button">Öffnen</button>
        ${p.type === "followup" ? "" : `<button class="secondary-btn" data-create-followup="${p.id}" type="button">Nachbegehung aus offenen Punkten erstellen</button>`}
        <button class="secondary-btn" data-duplicate-acceptance="${p.id}" type="button">Duplizieren</button>
        <button class="danger-btn" data-delete="${p.id}" type="button">Abnahme löschen</button>
      </div>
    </article>
  `;
}

function renderHomeProjects() {
  renderProjectDirectory();
}

function projectDirectoryCard(project) {
  const stats = projectStats(project);
  const address = projectAddressText(project, { multiline: false }) || "Adresse offen";
  return `
    <article class="project-directory-card" data-project="${escapeAttr(project.id)}">
      <div class="project-directory-main">
        <h3>${escapeHtml(project.name || "Unbenanntes Projekt")}</h3>
        <p class="muted">${escapeHtml(address)}</p>
        <p class="project-directory-meta">${stats.acceptances.length} BA · ${stats.siteControls.length} BK · ${stats.dailyReports.length} BT · ${stats.openPoints} offene Punkte · zuletzt ${escapeHtml(formatDate(stats.latest))}</p>
      </div>
      <div class="project-directory-actions">
        <button class="primary-btn" data-open-project="${escapeAttr(project.id)}" type="button">Öffnen</button>
        <button class="secondary-btn" data-edit-project="${escapeAttr(project.id)}" type="button">Bearbeiten</button>
      </div>
    </article>`;
}

function renderProjectDirectory() {
  const list = $("#projectDirectoryList");
  if (!list) return;
  const search = ($("#projectSearchInput")?.value || "").trim().toLowerCase();
  const projects = [...state.projects].sort((a, b) => String(projectStats(b).latest || "").localeCompare(String(projectStats(a).latest || "")));
  const filtered = search ? projects.filter((project) => {
    const stats = projectStats(project);
    const haystack = [
      project.name,
      formatAddress(project.address || project.siteAddress, { multiline: false }),
      project.client,
      project.clientSnapshot?.name,
      String(stats.acceptances.length),
      String(stats.siteControls.length),
      String(stats.dailyReports.length)
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(search);
  }) : projects;
  if (!filtered.length) {
    list.innerHTML = `<div class="empty-card muted">${state.projects.length ? "Kein Projekt zur Suche gefunden." : "Noch keine Projekte vorhanden. Lege ein Projekt an, danach wählst du darin das passende Modul."}</div>`;
    return;
  }
  list.innerHTML = filtered.map((project) => projectDirectoryCard(project)).join("");
}

function renderProjectHub() {
  const hub = $("#projectHubContent");
  if (!hub) return;
  const project = projectById(state.currentProjectId) || state.projects[0] || null;
  if (!project) {
    hub.innerHTML = `<div class="panel"><p class="muted">Kein Projekt gewählt.</p><button class="primary-btn" id="projectHubNewProjectBtn" type="button">Neues Projekt</button></div>`;
    return;
  }
  state.currentProjectId = project.id;
  const stats = projectStats(project);
  const openRebar = stats.acceptances.reduce((sum, protocol) => sum + sampleIssues(protocol).length, 0);
  const openSite = stats.siteControls.reduce((sum, protocol) => sum + (protocol.siteItems || []).filter(siteControlItemIsOpen).length, 0);
  hub.innerHTML = `
    <section class="panel project-hub-summary">
      <div>
        <h2>${escapeHtml(project.name || "Unbenanntes Projekt")}</h2>
        <p class="muted">${escapeHtml(projectAddressText(project, { multiline: false }) || "Adresse offen")}</p>
        ${project.client || project.clientSnapshot?.name ? `<p class="muted">Auftraggeber: ${escapeHtml(project.clientSnapshot?.name || project.client || "")}</p>` : ""}
        <p class="muted">Zuletzt bearbeitet: ${escapeHtml(formatDate(stats.latest))}</p>
      </div>
      <button class="secondary-btn" data-edit-project="${project.id}" type="button">Projekt bearbeiten</button>
    </section>
    <section class="panel">
      <h3>Module</h3>
      <div class="module-card-grid">
        ${moduleCard("BK", "Baustellenkontrolle", "Begehungen, Mängel, Aufgaben, Fotos", "site")}
        ${moduleCard("BT", "Bautagesbericht", "Arbeitszeiten, Tätigkeiten, Wetter, Fotos", "daily")}
        ${moduleCard("BA", "Bewehrungsabnahme", "Bewehrung prüfen, Pins, Nachbegehung, A4-Bericht", "rebar")}
        ${moduleCard("PL", "Pläne", "Projektpläne verwalten und anzeigen", "plans")}
        ${moduleCard("PI", "Projekt bearbeiten", "Projektkopf, Adresse, Beteiligte, Zuordnungen", "projectData")}
        ${moduleCard("OP", "Offene Punkte", `${openRebar + openSite} Mängel, Aufgaben, Auflagen`, "openPoints")}
        ${moduleCard("BP", "Berichte / Protokolle", "Vorhandene Berichte und Protokolle", "reports")}
        ${moduleCard("PV", "Zurück zur Projektverwaltung", "Projektliste und Projektwahl", "directory")}
      </div>
    </section>
    <section class="panel">
      <div class="section-head"><h3>Bewehrungsabnahmen</h3><button class="primary-btn" data-new-acceptance="${project.id}" type="button">+ Neue Abnahme</button></div>
      <div class="acceptance-list">${stats.acceptances.length ? stats.acceptances.map((p) => acceptanceCard(p)).join("") : `<div class="empty-card muted">Noch keine Bewehrungsabnahme in diesem Projekt.</div>`}</div>
    </section>
    <section class="panel">
      <div class="section-head"><h3>Bautagesberichte</h3><button class="primary-btn" data-new-daily-report="${project.id}" type="button">Neuer Bautagesbericht</button></div>
      <div class="acceptance-list">${stats.dailyReports.length ? stats.dailyReports.map(dailyReportListCard).join("") : `<div class="empty-card muted">Noch kein Bautagesbericht in diesem Projekt.</div>`}</div>
    </section>
    <section class="panel">
      <div class="section-head"><h3>Baustellenkontrollen</h3><button class="primary-btn" data-new-site-control="${project.id}" type="button">Baustellenkontrolle starten</button></div>
      <div class="acceptance-list">${stats.siteControls.length ? stats.siteControls.map((protocol) => `<article class="acceptance-card"><div><h4>${escapeHtml(protocol.head.acceptanceTitle || "Baustellenkontrolle")}</h4><div class="muted">${escapeHtml(formatDate(protocol.head.createdAt || protocol.createdAt))} · ${escapeHtml(protocol.siteControl?.reason || "Regelbegehung")}</div><div class="muted">${(protocol.siteItems || []).length} Feststellung(en) · ${(protocol.siteItems || []).filter(siteControlItemIsOpen).length} offen</div></div><div class="card-actions"><button class="secondary-btn" data-open-site-control="${protocol.id}" type="button">Öffnen</button></div></article>`).join("") : `<div class="empty-card muted">Noch keine Baustellenkontrolle in diesem Projekt.</div>`}</div>
    </section>`;
}

function findProjectPlanEntry(protocolId, planId) {
  const protocol = state.protocols.find((item) => item.id === protocolId);
  const plan = protocol?.plans?.find((item) => item.id === planId);
  return protocol && plan ? { protocol, plan: normalizePlanMeta(plan) } : null;
}

function updateProjectPlanField(input) {
  const card = input.closest("[data-project-plan]");
  if (!card) return;
  const entry = findProjectPlanEntry(card.dataset.protocolId, card.dataset.projectPlan);
  if (!entry) return;
  const field = input.dataset.projectPlanField;
  if (!field || field === "pageCount") return;
  entry.plan[field] = input.value || "";
  if (field === "source" && entry.plan.source !== "uploaded" && !entry.plan.syncStatus) entry.plan.syncStatus = "linked";
  entry.plan.updatedAt = new Date().toISOString();
  entry.protocol.updatedAt = entry.plan.updatedAt;
  syncPlanRecord(entry.plan);
  schedulePersist();
}

function openProjectPlanDropboxLink(protocolId, planId) {
  const entry = findProjectPlanEntry(protocolId, planId);
  const link = entry?.plan?.dropboxSharedLink || entry?.plan?.dropboxLink || "";
  if (!link) return showAppToast("Kein Dropbox-Link hinterlegt.", { type: "info" });
  window.open(link, "_blank", "noopener,noreferrer");
}

function renderProjectPlansView() {
  const container = $("#projectPlansContent");
  if (!container) return;
  const project = projectById(state.currentProjectId) || null;
  if (!project) {
    container.innerHTML = `<section class="panel"><p class="muted">Kein Projekt gewählt. Bitte zuerst ein Projekt öffnen.</p></section>`;
    return;
  }
  const searchValue = $("#projectPlanSearchInput")?.value || "";
  const entries = projectPlanEntries(project.id);
  const normalizedSearch = searchValue.trim().toLowerCase();
  const visibleEntries = normalizedSearch
    ? entries.filter(({ protocol, plan }) => [plan.planNumber, plan.appPlanName, plan.title, plan.category, plan.floor, plan.component, plan.fileName, plan.planDate, plan.planIndex, plan.documentStatus, acceptanceLabel(protocol)].join(" ").toLowerCase().includes(normalizedSearch))
    : entries;
  const folderHint = project.dropboxFolder ? `${escapeHtml(project.dropboxFolder)}${escapeHtml(project.planFolder || state.settings.dropboxPlanFolder || "Pläne")}` : "Kein Dropbox-Projektordner hinterlegt.";
  container.innerHTML = `
    <section class="panel project-plan-summary">
      <div>
        <h3>${escapeHtml(project.name || "Projekt")}</h3>
        <p class="muted">Projektordner: ${escapeHtml(project.dropboxFolder || "nicht hinterlegt")}</p>
        <p class="muted">Planablage: ${folderHint}</p>
      </div>
      <button class="secondary-btn" data-edit-project="${escapeAttr(project.id)}" type="button">Projekt bearbeiten</button>
    </section>
    <section class="panel project-plan-toolbar-card">
      <div class="section-head">
        <div>
          <h3>Projektpläne</h3>
          <p class="muted">Pläne werden projektweise lokal in IndexedDB gespeichert und stehen Bewehrungsabnahme und Baustellenkontrolle zur Verfügung.</p>
        </div>
        <button class="primary-btn" id="projectPlanUploadBtn" type="button">Plan hochladen</button>
      </div>
      <input id="projectPlanUploadInput" class="visually-hidden" type="file" accept="application/pdf,image/png,image/jpeg,image/webp" multiple>
      <label>Plan suchen
        <input id="projectPlanSearchInput" type="search" value="${escapeAttr(searchValue)}" placeholder="Plan-Nr., Bezeichnung, Datei, Stand">
      </label>
      <p class="field-hint">Dropbox ist vorbereitet. Automatischer Abgleich wird später über eine Anbindung aktiviert; aktuell werden Dateien lokal auf diesem Gerät gespeichert.</p>
      <datalist id="appPlanNameSuggestions">${APP_PLAN_NAME_SUGGESTIONS.map((value) => `<option value="${escapeAttr(value)}"></option>`).join("")}</datalist>
      <datalist id="projectPlanFloorOptions">${PLAN_FLOOR_OPTIONS.map((value) => `<option value="${escapeAttr(value)}"></option>`).join("")}</datalist>
      <datalist id="projectPlanComponentOptions">${PLAN_COMPONENT_OPTIONS.map((value) => `<option value="${escapeAttr(value)}"></option>`).join("")}</datalist>
    </section>
    <section class="panel">
      <div class="section-head">
        <h3>Importierte Planunterlagen</h3>
        <span class="badge neutral">${visibleEntries.length} von ${entries.length}</span>
      </div>
      ${visibleEntries.length ? visibleEntries.map(({ protocol, plan }) => safeProjectPlanCard(protocol, plan)).join("") : `<div class="empty-card muted">${entries.length ? "Keine passenden Planunterlagen gefunden. Bitte Suche/Filter prüfen." : "Keine Planunterlagen für dieses Projekt gefunden. Über „Plan hochladen“ können PDF- und Bildpläne direkt im Projekt gespeichert werden."}</div>`}
    </section>`;
}

function safeProjectPlanCard(protocol, plan) {
  try {
    return projectPlanCard(protocol, plan);
  } catch (error) {
    console.error("Planliste konnte nicht geladen werden", { error, planId: plan?.id, protocolId: protocol?.id });
    return `<div class="empty-card warning"><strong>Planliste konnte nicht geladen werden</strong><br><span class="muted">Plan: ${escapeHtml(plan?.fileName || plan?.title || plan?.id || "unbekannt")}</span></div>`;
  }
}

function projectPlanCard(protocol, plan) {
  normalizePlanMeta(plan);
  const display = planCompactTitle(plan);
  const file = plan.fileName || plan.dropboxFileName || "Datei offen";
  const link = validDropboxLink(plan);
  const pins = allPinsForPlan(plan).length;
  const summary = [
    plan.category || "Sonstiges",
    plan.floor || "ohne Geschoss",
    plan.component || "ohne Bauteil",
    plan.planDate ? `Stand ${plan.planDate}` : "ohne Stand",
    plan.planIndex ? `Index ${plan.planIndex}` : "ohne Index",
    pins ? `${pins} Pin(s)` : "ohne Pins"
  ].join(" · ");
  return `
    <details class="project-plan-card project-plan-accordion" data-project-plan="${escapeAttr(plan.id)}" data-protocol-id="${escapeAttr(protocol.id)}">
      <summary class="project-plan-summary-row">
        <span class="project-plan-summary-main">
          <strong>${escapeHtml(display)}</strong>
          <small>${escapeHtml(summary)}</small>
          <em>Datei: ${escapeHtml(file)}</em>
        </span>
        <span class="badge neutral">${escapeHtml(plan.documentStatus || "verwendet")}</span>
      </summary>
      <div class="project-plan-card-open">
        <div class="project-plan-card-head">
          ${projectPlanPreview(plan)}
          <div class="project-plan-card-main">
            <h4>${escapeHtml(display)}</h4>
            <p class="muted">${escapeHtml(planMetaLine(plan))}</p>
            <p class="muted">Aus: ${escapeHtml(isProjectPlanLibraryProtocol(protocol) ? "Projektplanablage" : acceptanceLabel(protocol))}</p>
            <p class="muted">Original-Datei: ${escapeHtml(file)}</p>
            <div class="card-actions compact-actions">
              <button class="secondary-btn" data-open-project-plan="${escapeAttr(plan.id)}" data-protocol-id="${escapeAttr(protocol.id)}" type="button">Plan öffnen / Vorschau</button>
              ${state.current ? `<button class="secondary-btn" data-use-project-plan="${escapeAttr(plan.id)}" data-protocol-id="${escapeAttr(protocol.id)}" type="button">Plan für Abnahme verwenden</button>` : ""}
              ${link ? `<button class="secondary-btn" data-open-dropbox-link="${escapeAttr(plan.id)}" data-protocol-id="${escapeAttr(protocol.id)}" type="button">In Dropbox öffnen</button>` : ""}
              <button class="project-delete-link" data-delete-project-plan="${escapeAttr(plan.id)}" data-protocol-id="${escapeAttr(protocol.id)}" type="button">Plan löschen</button>
            </div>
          </div>
        </div>
        <div class="grid compact-grid project-plan-fields">
          <label>Plannummer<input data-project-plan-field="planNumber" value="${escapeAttr(plan.planNumber || "")}" placeholder="z. B. B-002"></label>
          <label>App-Planbezeichnung<input data-project-plan-field="appPlanName" list="appPlanNameSuggestions" value="${escapeAttr(plan.appPlanName || "")}" placeholder="z. B. Bewehrung Bodenplatte untere Lage"></label>
          <label>Kategorie
            <select data-project-plan-field="category">
              ${PLAN_CATEGORIES.map((category) => `<option value="${escapeAttr(category)}" ${category === (plan.category || "Sonstiges") ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}
            </select>
          </label>
          <label>Geschoss<input data-project-plan-field="floor" list="projectPlanFloorOptions" value="${escapeAttr(plan.floor || "")}" placeholder="z. B. UG"></label>
          <label>Bauteil<input data-project-plan-field="component" list="projectPlanComponentOptions" value="${escapeAttr(plan.component || "")}" placeholder="z. B. Bodenplatte"></label>
          <label>Planstand<input data-project-plan-field="planDate" value="${escapeAttr(plan.planDate || "")}"></label>
          <label>Index<input data-project-plan-field="planIndex" value="${escapeAttr(plan.planIndex || "")}"></label>
          <label>Status
            <select data-project-plan-field="documentStatus">
              ${["maßgebend", "verwendet", "nur Orientierung", "ersetzt / veraltet"].map((status) => `<option value="${escapeAttr(status)}" ${status === (plan.documentStatus || "verwendet") ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
            </select>
          </label>
          <label>Quelle
            <select data-project-plan-field="source">
              ${[["uploaded", "Hochgeladene Datei"], ["dropbox_path", "Dropbox-Pfad"], ["dropbox_link", "Dropbox-Link"]].map(([value, label]) => `<option value="${value}" ${value === (plan.source || "uploaded") ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </label>
          <label>Seiten<input data-project-plan-field="pageCount" value="${escapeAttr(plan.pageCount || "")}" disabled></label>
        </div>
        <details class="project-plan-dropbox">
          <summary>Dropbox / spätere Synchronisierung</summary>
          <p class="muted">Dropbox ist vorbereitet. Automatischer Abgleich wird später über eine Dropbox-Anbindung aktiviert. Aktuell können Pfade und Links gespeichert werden. Noch keine automatische Synchronisierung.</p>
          <div class="grid compact-grid project-plan-fields">
            <label>Dropbox-Pfad<input data-project-plan-field="dropboxPath" value="${escapeAttr(plan.dropboxPath || "")}" placeholder="/Bauprojekte/.../Pläne/B-003.pdf"></label>
            <label>Dropbox-Link<input data-project-plan-field="dropboxSharedLink" value="${escapeAttr(plan.dropboxSharedLink || "")}" placeholder="https://www.dropbox.com/..."></label>
            <label>Dropbox-Dateiname<input data-project-plan-field="dropboxFileName" value="${escapeAttr(plan.dropboxFileName || "")}" placeholder="B-003.pdf"></label>
            <label>Letzter manueller Abgleich / Stand<input data-project-plan-field="lastManualSync" value="${escapeAttr(plan.lastManualSync || "")}" placeholder="z. B. 15.07.2026"></label>
            <label>Synchronisationsstatus
              <select data-project-plan-field="syncStatus">
                ${["not_configured", "linked", "needs_sync", "synced", "error"].map((status) => `<option value="${status}" ${status === (plan.syncStatus || "not_configured") ? "selected" : ""}>${escapeHtml(syncStatusLabel(status))}</option>`).join("")}
              </select>
            </label>
          </div>
        </details>
        <label>Bemerkung<textarea data-project-plan-field="remark" rows="2">${escapeHtml(plan.remark || "")}</textarea></label>
      </div>
    </details>`;
}

function useProjectPlanForCurrentAcceptance(protocolId, planId) {
  const entry = findProjectPlanEntry(protocolId, planId);
  if (!entry || !state.current) return showAppToast("Plan oder aktuelle Abnahme nicht gefunden.", { type: "error" });
  state.selectedPlanId = entry.plan.id;
  state.current.activePlanId = entry.plan.id;
  persist();
  showAppToast("Plan für diese Abnahme ausgewählt.", { type: "success" });
  navigateToView("editorView", { replace: true, keepProjectPlansReturn: true });
  activateProtocolTab("planTab", { replace: true });
  renderPlanControls();
  renderPlan();
}

function openProjectPlanPreview(protocolId, planId) {
  const protocol = state.protocols.find((item) => item.id === protocolId);
  if (!protocol) return showAppToast("Planquelle nicht gefunden.", { type: "error" });
  openProtocol(protocol);
  state.selectedPlanId = planId;
  state.current.activePlanId = planId;
  activateProtocolTab("planTab");
  renderPlanControls();
  renderPlan();
}

function moduleCard(code, title, subtitle, action) {
  return `<button class="module-card" type="button" data-project-module="${escapeAttr(action)}"><span class="module-code">${escapeHtml(code)}</span><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(subtitle)}</small></span></button>`;
}

function renderList() {
  const list = $("#protocolList");
  if (!state.projects.length) {
    list.innerHTML = `<div class="panel"><p class="muted">Noch keine lokalen Projekte vorhanden.</p></div>`;
    return;
  }
  const projects = (state.currentProjectId
    ? state.projects.filter((project) => project.id === state.currentProjectId)
    : [...state.projects]
  ).sort((a, b) => (b.id === state.currentProjectId) - (a.id === state.currentProjectId));
  list.innerHTML = projects.map((project) => {
    const stats = projectStats(project);
    const acceptances = stats.acceptances;
    return `
      <article class="project-card" data-project="${project.id}">
        <div class="section-head">
          <div>
            <h3>${escapeHtml(project.name || "Unbenanntes Projekt")}</h3>
            <div class="muted">${escapeHtml(projectAddressText(project, { multiline: false }) || "Adresse offen")}</div>
            <div class="muted">${acceptances.length} Abnahme(n) · zuletzt bearbeitet ${escapeHtml(formatDate(stats.latest))}</div>
          </div>
          <button class="primary-btn" data-new-acceptance="${project.id}" type="button">+ Neue Abnahme</button>
        </div>
        <div class="result-actions">
          <button class="secondary-btn" data-edit-project="${project.id}" type="button">Projekt bearbeiten</button>
        </div>
        <div class="acceptance-list">
          ${acceptances.length ? acceptances.map((p) => acceptanceCard(p)).join("") : `<div class="empty-card muted">Noch keine Abnahme in diesem Projekt.</div>`}
        </div>
        <details class="project-more-actions">
          <summary>Weitere Aktionen</summary>
          <button class="project-delete-link" data-delete-project="${project.id}" type="button">Projekt löschen</button>
        </details>
      </article>
    `;
  }).join("");
}

function currentPins() {
  const plan = selectedPlan();
  if (!state.current || !plan) return [];
  return state.current.pins.filter((pin) => pinHasPlacement(pin, plan.id, plan.currentPage));
}

function allPinsForPlan(plan) {
  if (!plan?.id) return [];
  const pins = state.current?.pins || [];
  return pins.filter((pin) => pinPlacements(pin).some((placement) => placement.planId === plan.id));
}

function confirmProjectDeletion(projectId) {
  const project = projectById(projectId);
  if (!project) return false;
  const projectName = project.name || "Unbenanntes Projekt";
  const confirmed = confirm("Projekt wirklich löschen? Alle Abnahmen, Pläne, Fotos und Protokolldaten dieses Projekts werden gelöscht.");
  if (!confirmed) return false;
  const typedName = prompt(`Bitte Projektname zur Bestätigung eingeben:\n${projectName}`);
  if (typedName !== projectName) {
    alert("Projekt wurde nicht gelöscht. Der eingegebene Projektname stimmt nicht überein.");
    return false;
  }
  return true;
}

function pinPlacements(pin) {
  if (!pin) return [];
  if (Array.isArray(pin.placements) && pin.placements.length) return pin.placements;
  if (pin.planId) {
    return [{
      id: `${pin.id}-primary`,
      planId: pin.planId,
      pageNumber: pin.pageNumber || 1,
      x: numberOrDefault(pin.x, 0.5),
      y: numberOrDefault(pin.y, 0.5),
      isPrimary: true
    }];
  }
  return [];
}

function pinHasPlacement(pin, planId, pageNumber) {
  return pinPlacements(pin).some((placement) => placement.planId === planId && placement.pageNumber === pageNumber);
}

function pinPlacementForCurrentPlan(pin) {
  const plan = selectedPlan();
  if (!plan) return null;
  return pinPlacements(pin).find((placement) => placement.planId === plan.id && placement.pageNumber === (plan.currentPage || 1)) || null;
}

function pinMarkerClass(pin) {
  const status = String(pin?.status || "").toLowerCase();
  let colorClass = "pin-neutral";
  if (status.includes("mangel") || status.includes("nicht ok")) colorClass = "pin-bad";
  else if (status.includes("auflage") || status.includes("teilweise") || status.includes("klär")) colorClass = "pin-partial";
  else if (status.includes("ok") || status.includes("fertig")) colorClass = "pin-ok";
  else if (status.includes("offen") || status.includes("hinweis")) colorClass = "pin-open";
  return `pin ${colorClass}`;
}

function currentMarkPlacement(pin) {
  return pinPlacements(pin).find((placement) => placement.planId === state.mark.planId && placement.pageNumber === state.mark.pageNumber) || null;
}

function renderPlanControls() {
  const plans = plansForCurrentProtocol();
  let plan = selectedPlan();
  if (!plan && plans.length) {
    plan = plans[0];
    state.selectedPlanId = plan.id;
    state.current.activePlanId = plan.id;
  }
  const projectPlan = isProjectPlan(plan);
  const isRenderable = isPlanRenderable(plan);
  const planSelect = $("#planSelect");
  planSelect.innerHTML = plans.length
    ? plans.map((item) => `<option value="${escapeAttr(item.id)}">${escapeHtml(planDisplayName(item))}${isProjectPlan(item) ? " (Projektplan)" : ""}</option>`).join("")
    : `<option value="">Kein Plan vorhanden</option>`;
  planSelect.value = plan?.id || "";
  $$("#planMetaFields [data-plan-field]").forEach((field) => {
    field.value = plan ? plan[field.dataset.planField] || "" : "";
    field.disabled = !plan || projectPlan;
  });
  const pageCountField = $('[data-plan-field="pageCount"]');
  if (pageCountField) pageCountField.disabled = true;
  const metaDetails = $(".plan-meta-details");
  if (metaDetails) metaDetails.classList.toggle("readonly-plan", !!projectPlan);
  renderPlanAutoHint(plan);
  const pageSelect = $("#pageSelect");
  if (plan?.type === "application/pdf") {
    const count = Math.max(1, plan.pageCount || 1);
    pageSelect.innerHTML = Array.from({ length: count }, (_, i) => `<option value="${i + 1}">Seite ${i + 1}</option>`).join("");
    pageSelect.value = plan.currentPage || 1;
    pageSelect.disabled = false;
  } else {
    pageSelect.innerHTML = `<option value="1">Seite 1</option>`;
    pageSelect.disabled = true;
  }
  if (!isRenderable) {
    state.pinMode = false;
    state.placementModePinId = "";
  }
  $("#pinModeBtn").disabled = !isRenderable;
  $("#pinModeBtn").title = isRenderable ? "" : "Bitte zuerst einen Plan laden.";
  $("#pinModeBtn").classList.toggle("pin-mode", state.pinMode);
  $("#pinModeBtn").textContent = state.pinMode ? "Nächster Tipp setzt Pin" : "Pin setzen";
  $(".plan-wrap").classList.toggle("pin-mode-active", state.pinMode || !!state.placementModePinId);
  $("#pinModeHint").classList.toggle("hidden", !state.pinMode && !state.placementModePinId);
  const placementPin = state.current.pins.find((pin) => pin.id === state.placementModePinId);
  $("#pinModeHint").textContent = placementPin
    ? `${pinLabel(placementPin)} Platzierungsmodus aktiv – auf Planstelle tippen`
    : "Pin-Modus aktiv – auf Planstelle tippen";
  $("#zoomLabel").textContent = `${Math.round((plan?.zoom || 1) * 100)} %`;
  const rotationLabel = $("#rotationLabel");
  if (rotationLabel) rotationLabel.textContent = `${planRotation(plan)}°`;
  renderPlanListStatus();
  renderPlanDebug();
  appendPlanSelectionDebug();
  syncPlanDebugDetails();
  renderPinList();
}

function isPlanRenderable(plan) {
  return !!(plan && plan.renderStatus === "loaded" && !plan.renderError);
}

function renderPlanListStatus() {
  const plans = plansForCurrentProtocol();
  const plan = selectedPlan();
  $("#planStatus").textContent = plan
    ? `${planStatusText(plan)} · ${selectedPlanSourceText(plan)}`
    : "Noch kein Plan im Projekt vorhanden.";
  $("#planList").innerHTML = plans.length ? plans.map((item) => {
    const projectPlan = isProjectPlan(item);
    return `
    <div class="plan-row ${item.id === state.selectedPlanId ? "active" : ""} ${projectPlan ? "project-plan-row" : ""}">
      <button data-select-plan="${escapeAttr(item.id)}" type="button">
        <strong>${escapeHtml(planDisplayName(item))}</strong>
        <span class="muted">${escapeHtml(planMetaLine(item))} · ${escapeHtml(selectedPlanSourceText(item))} · Datei: ${escapeHtml(item.fileName || item.dropboxFileName || "Datei")} · ${item.type === "application/pdf" ? `${item.pageCount || "?"} PDF-Seite(n)` : "Bildplan"} · ${allPinsForPlan(item).length} Markierung(en)</span>
      </button>
      ${projectPlan ? `<span class="plan-source-chip">Projektplan</span>` : `<button class="project-delete-link" data-delete-plan="${escapeAttr(item.id)}" type="button">Plan löschen</button>`}
    </div>`;
  }).join("") : `<div class="plan-row"><span class="muted">Keine Projektpläne vorhanden. Bitte Plan hochladen.</span></div>`;
}

function planStatusText(plan) {
  if (plan.renderStatus === "loading") return "Plan wird geladen ...";
  if (plan.renderStatus === "loaded") return `Plan geladen - ${plan.pageCount || 1} Seite(n) - ${formatBytes(plan.fileSize || 0)}`;
  if (plan.renderError) return plan.renderError;
  if (plan.type === "application/pdf") return `PDF gerendert über pdf.js · Seite ${plan.currentPage || 1} von ${plan.pageCount || "?"}`;
  if (plan.fileName) return "Bildplan geladen.";
  return "Plan wird geladen.";
}

function syncPlanDebugDetails() {
  const details = $("#planDebugDetails");
  if (!details) return;
  const plan = selectedPlan();
  details.open = !!plan?.renderError;
  const summary = details.querySelector("summary");
  if (summary) summary.textContent = plan?.renderError ? "Plan-Diagnose anzeigen (Fehler)" : "Plan-Diagnose anzeigen";
}

function renderPlanAutoHint(plan) {
  const hint = $("#planAutoHint");
  if (!hint) return;
  if (!plan) {
    hint.textContent = "Automatisch erkannte Plandaten werden hier angezeigt.";
    return;
  }
  const parts = [];
  if (plan.autoMetaStatus) parts.push(plan.autoMetaStatus);
  if (plan.planDateCandidates?.length) parts.push(`Datumskandidaten: ${plan.planDateCandidates.join(", ")}`);
  hint.textContent = parts.length ? parts.join(" · ") : "Keine automatische Plandaten-Erkennung vorhanden.";
}

function renderPlanDebug() {
  const target = $("#planDebug");
  if (!target) return;
  const plan = selectedPlan();
  if (!plan) {
    target.innerHTML = `
      <strong>Aktiver Plan:</strong> keiner ·
      selectedPlanId: ${escapeHtml(state.selectedPlanId || "-")} ·
      selectedPageNumber: -
    `;
    return;
  }
  target.innerHTML = `
    <strong>Aktiver Plan:</strong>
    ${escapeHtml(plan.fileName || "ohne Dateiname")} ·
    Typ: ${escapeHtml(plan.type || "unbekannt")} ·
    Größe: ${escapeHtml(formatBytes(plan.fileSize || 0))} ·
    ID: ${escapeHtml(plan.id)} ·
    Seite: ${escapeHtml(String(plan.currentPage || 1))} ·
    PDF-Seiten: ${escapeHtml(String(plan.pageCount || (plan.type === "application/pdf" ? "?" : 1)))} ·
    Renderstatus: ${escapeHtml(plan.renderStatus || "leer")}
  `;
}

function formatBytes(bytes = 0) {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function appendPlanSelectionDebug() {
  const target = $("#planDebug");
  if (!target) return;
  const plan = selectedPlan();
  const canvas = $("#pdfCanvas");
  const image = $("#planImage");
  const viewer = $(".plan-wrap");
  const stage = $("#planStage");
  const canvasRect = canvas?.getBoundingClientRect?.() || { width: 0, height: 0 };
  const imageRect = image?.getBoundingClientRect?.() || { width: 0, height: 0 };
  const stageRect = stage?.getBoundingClientRect?.() || { width: 0, height: 0 };
  const canvasStyle = canvas ? getComputedStyle(canvas) : null;
  const imageStyle = image ? getComputedStyle(image) : null;
  const details = [
    `selectedPlanId: ${state.selectedPlanId || "-"}`,
    `selectedPageNumber: ${plan?.currentPage || "-"}`,
    `Plan-ID: ${plan?.id || "-"}`,
    `Dateigroesse: ${formatBytes(plan?.fileSize || 0)}`,
    `Renderstatus: ${plan?.renderStatus || (plan ? "leer" : "kein Plan gewaehlt")}`,
    `Renderflaeche: ${plan?.renderSurface || "-"}`,
    `canvas.width: ${canvas?.width || 0}`,
    `canvas.height: ${canvas?.height || 0}`,
    `canvas.clientWidth: ${canvas?.clientWidth || 0}`,
    `canvas.clientHeight: ${canvas?.clientHeight || 0}`,
    `canvas rect: ${Math.round(canvasRect.width)}x${Math.round(canvasRect.height)}`,
    `canvas visible: ${canvasStyle && canvasStyle.display !== "none" && canvasRect.width > 0 && canvasRect.height > 0 ? "ja" : "nein"}`,
    `bild.clientWidth: ${image?.clientWidth || 0}`,
    `bild.clientHeight: ${image?.clientHeight || 0}`,
    `bild rect: ${Math.round(imageRect.width)}x${Math.round(imageRect.height)}`,
    `bild visible: ${imageStyle && imageStyle.display !== "none" && imageRect.width > 0 && imageRect.height > 0 ? "ja" : "nein"}`,
    `viewer.clientHeight: ${viewer?.clientHeight || 0}`,
    `viewer.scrollHeight: ${viewer?.scrollHeight || 0}`,
    `stage rect: ${Math.round(stageRect.width)}x${Math.round(stageRect.height)}`,
    `pan: ${Math.round(Number(plan?.panX) || 0)}/${Math.round(Number(plan?.panY) || 0)}`,
    `zoom: ${Math.round((Number(plan?.zoom) || 1) * 100)}%`
  ];
  if (plan?.renderError) details.push(`Fehlertext: ${plan.renderError}`);
  target.insertAdjacentHTML("beforeend", `<br><span>${escapeHtml(details.join(" | "))}</span>`);
}

function planDisplayName(plan) {
  normalizePlanMeta(plan);
  return planCompactTitle(plan);
}

function isPdfRenderCancelled(error) {
  return !!(error && (error.name === "RenderingCancelledException" || /cancel/i.test(error.message || "")));
}

async function cancelActivePlanRender() {
  const task = state.planRender?.task;
  if (!task) return;
  state.planRender.task = null;
  try {
    if (typeof task.cancel === "function") task.cancel();
    await task.promise;
  } catch (error) {
    if (!isPdfRenderCancelled(error)) console.warn("Vorheriger Plan-Render wurde beendet:", error);
  }
}

async function renderPlan() {
  const renderToken = ++state.planRender.token;
  await cancelActivePlanRender();
  if (renderToken !== state.planRender.token) return;
  const plan = selectedPlan();
  const image = $("#planImage");
  const canvas = $("#pdfCanvas");
  const empty = $("#emptyPlan");
  const layer = $("#pinLayer");
  const stage = $("#planStage");
  image.style.display = "none";
  canvas.style.display = "none";
  image.removeAttribute("src");
  image.classList.remove("rendered-pdf-image");
  stage.style.minHeight = "";
  layer.innerHTML = "";
  if (!plan) {
    stage.style.width = "100%";
    stage.style.minWidth = "100%";
    stage.style.transform = "translate3d(0, 0, 0)";
    empty.style.display = "grid";
    empty.textContent = "Plan hinzufügen, um die Planunterlage als Vorschau zu prüfen.";
    renderPlanDebug();
    renderPinList();
    return;
  }
  plan.panX = Number(plan.panX) || 0;
  plan.panY = Number(plan.panY) || 0;
  plan.renderStatus = "loading";
  plan.renderError = "";
  empty.style.display = "grid";
  empty.textContent = "Plan wird geladen ...";
  renderPlanDebug();
  if (plan.type === "application/pdf") {
    await renderPdfPlan(plan, renderToken);
  } else if (plan.type.startsWith("image/")) {
    try {
      const imageUrl = await getPlanObjectUrl(plan);
      image.onload = () => {
        applyPlanElementSize(image, plan, image.naturalWidth);
        plan.renderStatus = "loaded";
        plan.renderError = "";
        empty.style.display = "none";
        renderPlanControls();
      };
      image.onerror = () => {
        setPlanRenderError(plan, "Bild konnte nicht geladen werden.");
      };
      image.src = imageUrl;
      image.style.display = "block";
      if (image.naturalWidth) {
        applyPlanElementSize(image, plan, image.naturalWidth);
        plan.renderStatus = "loaded";
        empty.style.display = "none";
      }
    } catch (error) {
      setPlanRenderError(plan, error.message || String(error));
    }
  } else {
    setPlanRenderError(plan, "Dateityp wird nicht unterstützt.");
  }
  if (isPlanRenderable(plan)) currentPins().forEach((pin) => renderPinButton(pin));
  renderPinList();
  renderPlanControls();
}

async function renderPdfPlan(plan, renderToken) {
  const debugCanvas = $("#pdfCanvas");
  const image = $("#planImage");
  const empty = $("#emptyPlan");
  const renderCanvas = document.createElement("canvas");
  try {
    if (!window.pdfjsLib) throw new Error("pdf.js nicht geladen");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    const planRecord = await idbGet("plans", plan.id);
    if (renderToken !== state.planRender.token) return;
    if (!planRecord?.blob) throw new Error("Planinhalt fehlt. Bitte Plan erneut importieren.");
    if (!planRecord.blob.size) throw new Error("Planinhalt ist leer. Bitte Plan erneut importieren.");
    plan.fileSize = planRecord.blob.size || plan.fileSize || 0;
    const doc = await getPdfDocument(plan);
    if (renderToken !== state.planRender.token) return;
    plan.pageCount = doc.numPages;
    plan.currentPage = Math.min(Math.max(1, plan.currentPage || 1), doc.numPages);
    const page = await doc.getPage(plan.currentPage);
    if (renderToken !== state.planRender.token) return;
    const viewport = page.getViewport({ scale: 2, rotation: planRotation(plan) });
    renderCanvas.width = Math.max(1, Math.floor(viewport.width));
    renderCanvas.height = Math.max(1, Math.floor(viewport.height));
    if (debugCanvas) {
      debugCanvas.width = renderCanvas.width;
      debugCanvas.height = renderCanvas.height;
      debugCanvas.style.display = "none";
    }
    const ctx = renderCanvas.getContext("2d", { alpha: false });
    ctx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, renderCanvas.width, renderCanvas.height);
    const renderTask = page.render({ canvasContext: ctx, viewport });
    state.planRender.task = renderTask;
    try {
      await renderTask.promise;
    } finally {
      if (state.planRender.task === renderTask) state.planRender.task = null;
    }
    if (renderToken !== state.planRender.token) return;
    if (!renderCanvas.width || !renderCanvas.height) throw new Error("PDF-Seite wurde ohne sichtbare Canvas-Größe gerendert.");
    const dataUrl = renderCanvas.toDataURL("image/png");
    state.pdfPageCache.set(`${plan.id}:${plan.currentPage}`, dataUrl);
    await showRenderedPdfImage(image, dataUrl, plan, renderCanvas.width, renderToken);
    if (renderToken !== state.planRender.token) return;
    if (debugCanvas) debugCanvas.style.display = "none";
    empty.style.display = "none";
    plan.renderStatus = "loaded";
    plan.renderError = "";
    plan.renderSurface = "image-fallback";
    persist();
  } catch (error) {
    if (renderToken !== state.planRender.token || isPdfRenderCancelled(error)) return;
    setPlanRenderError(plan, error.message || String(error));
    persist();
  }
}

function showRenderedPdfImage(image, dataUrl, plan, naturalWidth, renderToken = state.planRender.token) {
  return new Promise((resolve, reject) => {
    image.dataset.renderToken = String(renderToken);
    image.onload = () => {
      if (image.dataset.renderToken !== String(renderToken)) {
        resolve();
        return;
      }
      image.classList.add("rendered-pdf-image");
      image.style.display = "block";
      image.style.visibility = "visible";
      image.style.opacity = "1";
      image.style.width = "100%";
      image.style.height = "auto";
      image.style.maxWidth = "none";
      applyPlanElementSize(image, plan, image.naturalWidth || naturalWidth || 900);
      resolve();
    };
    image.onerror = () => reject(new Error("Gerenderte PDF-Seite konnte nicht als Bild angezeigt werden."));
    image.alt = `${plan.planNumber || plan.fileName || "PDF-Plan"} Seite ${plan.currentPage || 1}`;
    image.src = dataUrl;
  });
}

function setPlanRenderError(plan, detail = "") {
  plan.renderStatus = "error";
  plan.renderError = [
    "Plan konnte nicht angezeigt werden.",
    `Datei: ${plan.fileName || "unbekannt"}`,
    `Dateityp: ${plan.type || "unbekannt"}`,
    `Dateigröße: ${formatBytes(plan.fileSize || 0)}`,
    detail ? `Fehler: ${detail}` : "",
    plan.type === "application/pdf" ? "PDF konnte nicht gerendert werden. Bitte Planseite als JPG/PNG hochladen." : ""
  ].filter(Boolean).join("\n");
  const empty = $("#emptyPlan");
  empty.style.display = "grid";
  empty.innerHTML = `<div><strong>Plan konnte nicht angezeigt werden.</strong><pre>${escapeHtml(plan.renderError)}</pre><div class="result-actions"><button class="secondary-btn" type="button" id="retryPlanRenderBtn">Plan erneut laden</button><button class="secondary-btn" type="button" id="chooseAnotherPlanBtn">Andere Datei wählen</button></div></div>`;
  $("#planImage").style.display = "none";
  $("#pdfCanvas").style.display = "none";
  renderPlanDebug();
}

async function getPdfDocument(plan) {
  if (state.pdfDocs.has(plan.id)) return state.pdfDocs.get(plan.id);
  const planRecord = await idbGet("plans", plan.id);
  if (!planRecord?.blob) throw new Error("Planinhalt fehlt. Bitte Plan erneut importieren.");
  if (!planRecord.blob.size) throw new Error("Planinhalt ist leer. Bitte Plan erneut importieren.");
  plan.fileSize = planRecord.blob.size || plan.fileSize || 0;
  const bytes = await planRecord.blob.arrayBuffer();
  if (!bytes.byteLength) throw new Error("Plan-Datei konnte nicht gelesen werden.");
  const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
  const doc = await loadingTask.promise;
  state.pdfDocs.set(plan.id, doc);
  return doc;
}

async function renderPdfPageToDataUrl(plan, pageNumber) {
  const cacheKey = `${plan.id}:${pageNumber}`;
  if (state.pdfPageCache.has(cacheKey)) return state.pdfPageCache.get(cacheKey);
  const doc = await getPdfDocument(plan);
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
  const dataUrl = canvas.toDataURL("image/png");
  state.pdfPageCache.set(cacheKey, dataUrl);
  return dataUrl;
}

function renderPinButton(pin) {
  const placement = pinPlacementForCurrentPlan(pin);
  if (!placement) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = `${pinMarkerClass(pin)} ${pin.id === state.selectedPinId ? "selected" : ""}`;
  button.textContent = pinLabel(pin);
  button.style.left = `${placement.x * 100}%`;
  button.style.top = `${placement.y * 100}%`;
  button.dataset.pin = pin.id;
  $("#pinLayer").appendChild(button);
}

function addPinAt(clientX, clientY) {
  if (!state.pinMode && !state.placementModePinId) return;
  const plan = selectedPlan();
  if (!plan) return;
  const target = visiblePlanElement();
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (rect.width < 20 || rect.height < 20) return;
  const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
  if (state.placementModePinId) {
    addPlacementToPin(state.placementModePinId, plan, x, y);
    return;
  }
  const pin = {
    id: uid("pin"),
    number: nextPinNumber(),
    planId: plan.id,
    pageNumber: plan.currentPage || 1,
    x,
    y,
    placements: [{
      id: uid("placement"),
      planId: plan.id,
      pageNumber: plan.currentPage || 1,
      x,
      y,
      label: "",
      isPrimary: true
    }],
    title: "",
    status: "teilweise / Auflage",
    note: "",
    photos: [],
    checkpointIds: []
  };
  state.current.pins.push(pin);
  state.selectedPinId = pin.id;
  state.pinMode = false;
  state.placementModePinId = "";
  saveFromForm();
  renderPlan();
  renderPinEditor();
  renderChecklist();
}

function addPlacementToPin(pinId, plan, x, y) {
  const pin = state.current.pins.find((item) => item.id === pinId);
  if (!pin) return;
  const pageNumber = plan.currentPage || 1;
  pin.placements = pinPlacements(pin).filter((placement) => !(placement.planId === plan.id && placement.pageNumber === pageNumber));
  pin.placements.push({
    id: uid("placement"),
    planId: plan.id,
    pageNumber,
    x,
    y,
    label: "",
    isPrimary: !pin.placements.length
  });
  const primary = pin.placements.find((placement) => placement.isPrimary) || pin.placements[0];
  pin.planId = primary.planId;
  pin.pageNumber = primary.pageNumber;
  pin.x = primary.x;
  pin.y = primary.y;
  state.selectedPinId = pin.id;
  state.pinMode = false;
  state.placementModePinId = "";
  saveFromForm();
  renderPlan();
  renderPinEditor();
  renderChecklist();
}

function visiblePlanElement() {
  const plan = selectedPlan();
  if (!plan) return null;
  if (plan.type === "application/pdf") {
    const image = $("#planImage");
    if (image?.classList.contains("rendered-pdf-image") && image.style.display !== "none") return image;
    return $("#pdfCanvas");
  }
  return $("#planImage");
}

function applyPlanElementSize(element, plan, naturalWidth) {
  const stage = $("#planStage");
  const viewer = $(".plan-viewer");
  const baseWidth = Math.max(240, (viewer?.clientWidth || stage?.parentElement?.clientWidth || 800) - 16);
  const zoom = Math.min(5, Math.max(0.5, Number(plan?.zoom) || 1));
  const displayWidth = Math.max(180, Math.round(baseWidth * zoom));
  element.style.width = `${displayWidth}px`;
  element.style.maxWidth = "none";
  element.style.height = "auto";
  element.style.transform = "none";
  if (stage) {
    stage.style.width = `${displayWidth}px`;
    stage.style.minWidth = stage.style.width;
    stage.style.maxWidth = "none";
    stage.style.minHeight = "0";
    stage.style.transform = "none";
    requestAnimationFrame(() => {
      const width = element.clientWidth || displayWidth || 1;
      const height = element.clientHeight || stage.clientHeight || 1;
      stage.style.width = `${width}px`;
      stage.style.minWidth = stage.style.width;
      stage.style.height = `${height}px`;
      stage.style.minHeight = stage.style.height;
    });
  }
}

function clampPlanPan(plan) {
  if (!plan) return;
  const viewer = $(".plan-viewer");
  const stage = $("#planStage");
  if (!viewer || !stage) return;
  const viewerWidth = Math.max(1, viewer.clientWidth || viewer.getBoundingClientRect().width || 1);
  const viewerHeight = Math.max(1, viewer.clientHeight || viewer.getBoundingClientRect().height || 1);
  const contentWidth = Math.max(1, stage.offsetWidth || stage.getBoundingClientRect().width || 1);
  const contentHeight = Math.max(1, stage.offsetHeight || stage.getBoundingClientRect().height || 1);
  const minX = contentWidth > viewerWidth ? viewerWidth - contentWidth : (viewerWidth - contentWidth) / 2;
  const maxX = contentWidth > viewerWidth ? 0 : (viewerWidth - contentWidth) / 2;
  const minY = contentHeight > viewerHeight ? viewerHeight - contentHeight : (viewerHeight - contentHeight) / 2;
  const maxY = contentHeight > viewerHeight ? 0 : (viewerHeight - contentHeight) / 2;
  plan.panX = Math.min(maxX, Math.max(minX, Number(plan.panX) || 0));
  plan.panY = Math.min(maxY, Math.max(minY, Number(plan.panY) || 0));
}

function applyPlanTransform(plan = selectedPlan()) {
  const stage = $("#planStage");
  if (!stage || !plan) return;
  const x = Number(plan.panX) || 0;
  const y = Number(plan.panY) || 0;
  stage.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}

function nextPinNumber() {
  return state.current.pins.reduce((max, pin) => Math.max(max, pin.number || 0), 0) + 1;
}

function renderPinList() {
  const pins = currentPins();
  $("#pinList").innerHTML = pins.length ? pins.map((pin) => `
    <button class="pin-row ${pin.id === state.selectedPinId ? "active" : ""}" data-pin="${pin.id}" type="button">
      <strong>${pinLabel(pin)} ${escapeHtml(pin.title || "")}</strong>
      <span class="muted">${escapeHtml(pin.status)} · ${escapeHtml(selectedPlan()?.planNumber || selectedPlan()?.fileName || "")} / Seite ${pinPlacementForCurrentPlan(pin)?.pageNumber || selectedPlan()?.currentPage || 1} · ${pinPlacements(pin).length} Platzierung(en)</span>
    </button>
  `).join("") : `<div class="pin-row"><span class="muted">Keine Pins auf diesem Plan / dieser Seite.</span></div>`;
}

function renderPinEditor() {
  const panel = $("#selectedPinPanel");
  const pin = selectedPin();
  if (!selectedPlan()) {
    panel.innerHTML = `<p class="muted">Plan hinzufügen, um Pins zu setzen.</p>`;
    return;
  }
  if (!pin) {
    panel.innerHTML = `<p class="muted">Pin auswählen oder „Pin setzen“ aktivieren.</p>`;
    return;
  }
  panel.innerHTML = `
    <h3>${pinLabel(pin)} bearbeiten</h3>
    <p class="muted">${escapeHtml(pinPlacements(pin).map((placement) => {
      const plan = planById(placement.planId);
      return `${plan ? planDisplayName(plan) : "Plan"} · Seite ${placement.pageNumber}`;
    }).join(" | "))}</p>
    <label>Titel / Bereich<input data-pin-field="title" value="${escapeAttr(pin.title)}"></label>
    ${statusButtons(pin.status, "pin-status")}
    <label class="voice-field">Bemerkung
      <textarea data-pin-field="note" rows="3">${escapeHtml(pin.note)}</textarea>
      <button class="mic-btn" type="button" data-voice-pin="${pin.id}">Mikrofon</button>
    </label>
    <section class="pin-placements">
      <div class="section-head">
        <h4>Platzierungen</h4>
        <button class="secondary-btn" type="button" data-add-placement="${pin.id}">Weitere Platzierung setzen</button>
      </div>
      ${pinPlacementList(pin)}
      <p class="muted">Ein Sachverhalt kann damit z. B. im Grundriss und im Schnitt mit demselben Pin erscheinen.</p>
    </section>
    ${thumbs(pin.photos)}
    <div class="result-actions">
      <button class="secondary-btn" type="button" data-photo-pin-camera="${pin.id}">Foto aufnehmen</button>
      <button class="secondary-btn" type="button" data-photo-pin-gallery="${pin.id}">Foto aus Galerie auswählen</button>
      <button class="danger-btn" type="button" data-remove-pin="${pin.id}">Pin löschen</button>
    </div>
  `;
  hydratePhotoThumbs(panel);
}

function pinPlacementList(pin) {
  const placements = pinPlacements(pin);
  return `<div class="placement-list">${placements.map((placement) => {
    const plan = planById(placement.planId);
    return `
      <div class="placement-row">
        <span>${placement.isPrimary ? "<strong>Hauptplatzierung</strong> · " : ""}${escapeHtml(plan ? planDisplayName(plan) : "Plan")} · Seite ${placement.pageNumber} · x ${Math.round(placement.x * 100)} % / y ${Math.round(placement.y * 100)} %</span>
        <div class="placement-actions">
          ${!placement.isPrimary ? `<button class="small-btn" type="button" data-primary-placement="${pin.id}" data-placement-id="${placement.id}">Als Hauptplatzierung</button>` : ""}
          ${placements.length > 1 ? `<button class="danger-btn" type="button" data-remove-placement="${pin.id}" data-placement-id="${placement.id}">Entfernen</button>` : ""}
        </div>
      </div>
    `;
  }).join("")}</div>`;
}

function selectedPin() {
  return state.current?.pins.find((pin) => pin.id === state.selectedPinId) || null;
}

function startPlacementMode(pinId) {
  if (!selectedPlan()) return alert("Bitte zuerst einen Plan auswählen.");
  const pin = state.current.pins.find((item) => item.id === pinId);
  if (!pin) return;
  state.selectedPinId = pin.id;
  state.placementModePinId = pin.id;
  state.pinMode = false;
  renderPlanControls();
  renderPinEditor();
}

function syncPinPrimaryFromPlacements(pin) {
  const placements = pinPlacements(pin);
  pin.placements = placements;
  const primary = placements.find((placement) => placement.isPrimary) || placements[0];
  if (!primary) return;
  placements.forEach((placement) => placement.isPrimary = placement.id === primary.id);
  pin.planId = primary.planId;
  pin.pageNumber = primary.pageNumber;
  pin.x = primary.x;
  pin.y = primary.y;
}

function removePinPlacement(pinId, placementId) {
  const pin = state.current.pins.find((item) => item.id === pinId);
  if (!pin) return;
  const placements = pinPlacements(pin);
  if (placements.length <= 1) return alert("Mindestens eine Platzierung muss erhalten bleiben.");
  const removedPrimary = placements.find((placement) => placement.id === placementId)?.isPrimary;
  pin.placements = placements.filter((placement) => placement.id !== placementId);
  if (removedPrimary && pin.placements[0]) pin.placements[0].isPrimary = true;
  syncPinPrimaryFromPlacements(pin);
  state.placementModePinId = state.placementModePinId === pin.id ? "" : state.placementModePinId;
  persist();
  renderPlan();
  renderPinEditor();
  renderPinList();
}

function makePrimaryPlacement(pinId, placementId) {
  const pin = state.current.pins.find((item) => item.id === pinId);
  if (!pin) return;
  pin.placements = pinPlacements(pin).map((placement) => ({ ...placement, isPrimary: placement.id === placementId }));
  syncPinPrimaryFromPlacements(pin);
  persist();
  renderPlan();
  renderPinEditor();
  renderPinList();
}

function planById(planId) {
  if (!planId) return null;
  const localPlan = state.current?.plans?.find((plan) => plan.id === planId);
  if (localPlan) return localPlan;
  const projectId = state.current?.projectId || state.currentProjectId;
  const entry = projectPlanEntries(projectId).find(({ plan }) => plan.id === planId);
  return entry?.plan || null;
}

function pinLabel(pin) {
  return `P${pin.number || state.current.pins.findIndex((p) => p.id === pin.id) + 1}`;
}

function checkHasDocumentation(check) {
  return !!(
    check.note ||
    check.pinId ||
    check.photos?.length ||
    (check.status && check.status !== "offen / nicht bewertet" && check.status !== "nicht relevant") ||
    (check.samples || []).some((sample) => sampleHasDocumentation(sample))
  );
}

function sampleHasDocumentation(sample = {}) {
  return !!(
    sample.note ||
    sample.location ||
    sample.pinId ||
    sample.photos?.length ||
    sample.status === "Dokumentation" ||
    (sample.status && sample.status !== "offen / nicht bewertet" && sample.status !== "nicht relevant")
  );
}

function checkHasIssue(check) {
  return (check.samples || []).some((sample) =>
    sample.status === "teilweise / Auflage" ||
    sample.status === "nicht OK / Mangel" ||
    sample.overlapCheck?.resultStatus === "teilweise / Auflage" ||
    sample.overlapCheck?.resultStatus === "nicht OK / Mangel"
  );
}

function documentedStatusClass(status = "", hasDocumentation = false) {
  const value = status || "offen / nicht bewertet";
  const base = statusClassName(value);
  if (value.includes("nicht relevant") && hasDocumentation) return "doc neutral-documented";
  if (!hasDocumentation && (!value || value.includes("offen / nicht bewertet"))) return "empty";
  return base;
}

function checkVisualClass(check = {}) {
  const documented = checkHasDocumentation(check);
  const statusParts = documentedStatusClass(check.status, documented).split(/\s+/).filter(Boolean).map((item) => `check-status-${item}`);
  const parts = [documented ? "check-state-documented" : "check-state-empty", ...statusParts];
  if (!check.active && !documented) parts.push("check-state-inactive");
  if (checkHasIssue(check)) parts.push("check-state-issue");
  return parts.join(" ");
}

function sampleVisualClass(sample = {}) {
  const documented = sampleHasDocumentation(sample);
  const status = sample.followupStatus || sample.status || "offen / nicht bewertet";
  const statusParts = documentedStatusClass(status, documented).split(/\s+/).filter(Boolean).map((item) => `sample-status-${item}`);
  return [documented ? "sample-state-documented" : "sample-state-empty", ...statusParts].join(" ");
}

function shouldIncludeCheckInReport(check) {
  return !!(check.manuallyActivated || checkHasDocumentation(check) || checkHasIssue(check));
}

function checkTemplateKey(component = "") {
  const value = component.toLowerCase();
  if (value.includes("filigran")) return "filigrandecke";
  if (value.includes("decke") || value.includes("unterzug")) return "decke";
  if (value.includes("wand")) return "wand";
  if (value.includes("stütze") || value.includes("stuetze")) return "stuetze";
  if (value.includes("rampe")) return "rampe";
  if (value.includes("bodenplatte") || value.includes("fundament")) return "bodenplatte";
  return "";
}

function normalizeCheckTitle(value = "") {
  return value
    .toLowerCase()
    .replace(/augenscheinlich/g, "")
    .replace(/durchstanzbewehrung\/schubbewehrung/g, "durchstanz-/schubbewehrung")
    .replace(/\s+/g, " ")
    .trim();
}

function checkTemplateOptions() {
  const masterComponents = state.masterData?.components || DEFAULT_MASTER_DATA.components || [];
  return uniqueValues([
    state.current?.head?.component,
    "Bodenplatte",
    "Decke / Filigrandecke",
    "Wand",
    "Unterzug",
    "Stütze",
    "Fundament",
    "Treppenhauskern",
    "Rampe",
    "Sonstige / frei",
    ...masterComponents
  ].filter(Boolean));
}

function checkTemplateLabel() {
  return state.current?.head?.component || checkTemplateOptions()[0] || "Bodenplatte";
}

function applyCheckScopeTemplate({ confirmUser = true } = {}) {
  if (!state.current) return;
  const hasExistingEntries = state.current.checkpoints.some((check) => check.manuallyActivated || checkHasDocumentation(check));
  if (confirmUser && hasExistingEntries && !confirm("Bauteil-Vorlage anwenden? Bestehende Einträge bleiben erhalten.")) return;
  const selectedTemplate = $("#checkTemplateSelect")?.value || state.current.head.component || state.current.head.acceptanceTitle || "";
  const key = checkTemplateKey(selectedTemplate);
  const activeTitles = new Set((CHECK_SCOPE_TEMPLATES[key] || CHECK_ITEMS).map(normalizeCheckTitle));
  state.current.checkpoints.forEach((check) => {
    if (checkHasDocumentation(check)) {
      check.active = true;
      return;
    }
    check.active = activeTitles.has(normalizeCheckTitle(check.title || ""));
    check.manuallyActivated = false;
  });
  if (selectedTemplate && selectedTemplate !== "Sonstige / frei") state.current.head.component = selectedTemplate;
  persist();
  renderChecklist();
}

function activateCheck(check, manual = false) {
  if (!check) return;
  state.openCheckId = check.id;
  check.active = true;
  if (manual) check.manuallyActivated = true;
  if (isFollowupProtocol() && !checkHasFollowupReference(check)) markFollowupNewCheck(check);
}

function checkHasFollowupReference(check) {
  return (check?.samples || []).some((sample) => sample.sourceStatus || sample.sourceNote || sample.sourcePinId || sample.referencePhotos?.length);
}

function markFollowupNewCheck(check) {
  check.isFollowupNew = true;
  check.createdInProtocolId = state.current?.id || check.createdInProtocolId || "";
  check.originProtocolId = null;
}

function isNewFollowupSample(check, sample) {
  return !!(
    isFollowupProtocol() &&
    (check?.isFollowupNew || sample?.isFollowupNew || (!sample?.sourceStatus && !sample?.sourceNote && !sample?.sourcePinId && !sample?.referencePhotos?.length))
  );
}

function renderChecklist() {
  const wrap = $("#checklist");
  if (!state.current) return;
  state.current.checkpoints.forEach(updateCheckStatus);
  const visibleChecks = state.current.checkpoints.filter((item) => item.active || checkHasDocumentation(item));
  const inactiveChecks = state.current.checkpoints.filter((item) => !item.active && !checkHasDocumentation(item));
  const activeCount = visibleChecks.length;
  const documentedCount = state.current.checkpoints.filter(checkHasDocumentation).length;
  const templateValue = checkTemplateLabel();
  if (!visibleChecks.some((item) => item.id === state.openCheckId)) state.openCheckId = "";
  const openCheck = visibleChecks.find((item) => item.id === state.openCheckId) || null;
  const visibleSamples = openCheck ? (openCheck.samples || []) : [];
  if (!visibleSamples.some((sample) => sample.id === state.openSampleId)) {
    const freshSample = visibleSamples.find(sampleNeedsInitialOpen);
    state.openSampleId = freshSample?.id || "";
  }
  wrap.innerHTML = `
    <section class="panel check-scope-panel">
      <div class="section-head">
        <div>
          <h3>Prüfumfang</h3>
          <p class="muted">Aktive oder dokumentierte Bereiche erscheinen im PDF-Protokoll.</p>
        </div>
      </div>
      <div class="check-scope-compact">
        <label>Vorlage für Bauteil
          <input id="checkTemplateSelect" list="componentOptions" value="${escapeAttr(templateValue)}" placeholder="z. B. Bodenplatte">
        </label>
        <button class="secondary-btn" type="button" data-apply-check-template>Vorlage anwenden</button>
        <div class="check-scope-status">${activeCount} Prüfpunkt(e) aktiv${documentedCount ? ` · ${documentedCount} dokumentiert` : ""}</div>
      </div>
      <details class="check-scope-details">
        <summary>Aktive Prüfpunkte bearbeiten</summary>
        <div class="check-scope-list">
          ${visibleChecks.map((item) => checkScopeRow(item)).join("")}
        </div>
      </details>
      <details class="check-scope-details">
        <summary>Weitere Prüfpunkte hinzufügen (${inactiveChecks.length})</summary>
        <div class="check-scope-list">
          ${inactiveChecks.length ? inactiveChecks.map((item) => checkScopeRow(item)).join("") : `<p class="muted">Alle Prüfpunkte sind aktiv oder dokumentiert.</p>`}
        </div>
      </details>
    </section>
    ${pinFindingSearchPanel()}
    ${visibleChecks.map((item) => checkAccordionCard(item, item.id === state.openCheckId)).join("")}
  `;
  state.current.checkpoints.forEach((check) => {
    check.samples.forEach((sample) => {
      const card = $(`[data-sample="${sample.id}"]`, wrap);
      if (!card) return;
      const pinField = $('[data-sample-field="pinId"]', card);
      if (pinField) pinField.value = sample.pinId || "";
    });
  });
  hydratePhotoThumbs(wrap);
}

function checkAccordionCard(item, isOpen) {
  return `
    <article class="check-item ${item.active ? "" : "inactive"} ${isOpen ? "open" : "collapsed"} ${checkVisualClass(item)}" data-check="${item.id}">
      <div class="check-head compact-check-head">
        <button class="check-toggle" type="button" data-toggle-check-panel="${item.id}" aria-expanded="${isOpen ? "true" : "false"}">
          <span class="check-toggle-title">${escapeHtml(item.title)}</span>
          <span class="check-toggle-summary">${checkSummary(item)}</span>
        </button>
        ${!item.active ? `<button class="secondary-btn" type="button" data-activate-check="${item.id}">aktivieren</button>` : ""}
      </div>
      <div class="check-body ${isOpen ? "" : "hidden"}">
        ${item.active
          ? `${item.samples.length ? item.samples.map((sample) => sampleCard(item, sample)).join("") : `<p class="muted">Noch keine Prüfstelle angelegt. Mit „+ Bereich“ eine Stichprobe dokumentieren.</p>`}<button class="secondary-btn check-add-sample-btn" type="button" data-add-sample="${item.id}">+ Bereich</button>`
          : `<p class="muted">Nicht im Protokoll berücksichtigt.</p>`}
      </div>
    </article>
  `;
}

function checkIsComplete(check) {
  if (!checkHasDocumentation(check)) return false;
  if (checkHasIssue(check)) return false;
  return ["fertig / OK", "Dokumentation", "nicht relevant"].includes(check.status);
}

function sampleNeedsInitialOpen(sample = {}) {
  const status = sample.followupStatus || sample.status || "offen / nicht bewertet";
  return !sampleHasDocumentation(sample) || status === "offen / nicht bewertet";
}

function sampleSummary(sample = {}, check = null, statusOverride = "") {
  const status = statusOverride || sample.followupStatus || sample.status || "offen / nicht bewertet";
  const parts = [statusLabel(status)];
  if (sample.location) parts.push(sample.location);
  const photos = (sample.photos || []).length;
  if (photos) parts.push(`${photos} Foto${photos === 1 ? "" : "s"}`);
  if (sample.note || sample.followupNote) parts.push("Bemerkung vorhanden");
  if (sample.pinId) parts.push("Pin vorhanden");
  if (!sampleHasDocumentation(sample)) parts.push("noch nicht dokumentiert");
  return parts.map(escapeHtml).join(" · ");
}

function checkSummary(check) {
  const photos = (check.photos || []).length + (check.samples || []).reduce((sum, sample) => sum + ((sample.photos || []).length), 0);
  const hasNote = !!(check.note || (check.samples || []).some((sample) => sample.note || sample.followupNote));
  const hasPin = !!(check.pinId || (check.samples || []).some((sample) => sample.pinId));
  const location = (check.samples || []).map((sample) => sample.location).filter(Boolean)[0] || "";
  const parts = [statusLabel(check.status || "offen / nicht bewertet")];
  if (location) parts.push(location);
  if (photos) parts.push(`${photos} Foto${photos === 1 ? "" : "s"}`);
  if (hasNote) parts.push("Bemerkung vorhanden");
  if (hasPin) parts.push("Pin vorhanden");
  if (!checkHasDocumentation(check)) parts.push("noch nicht dokumentiert");
  return parts.map(escapeHtml).join(" · ");
}

function checkScopeRow(item) {
  return `
    <label class="check-scope-row ${item.active ? "active" : ""}">
      <input type="checkbox" data-check-active="${item.id}" ${item.active ? "checked" : ""}>
      <span>${escapeHtml(item.title)}</span>
      <small>${item.active ? "aktiv" : "nicht im Protokoll berücksichtigt"}</small>
    </label>
  `;
}

function pinFindingSearchPanel() {
  const query = state.pinSearchQuery || "";
  const results = query.trim() ? pinFindingSearchResults(query) : [];
  return `
    <section class="panel pin-search-panel">
      <div class="section-head">
        <div>
          <h3>Pins / Feststellungen suchen</h3>
          <p class="muted">Pin-Nr., Prüfbereich, Plan, Status oder Bemerkung suchen.</p>
        </div>
      </div>
      <label>Pin, Bereich oder Text suchen
        <input id="pinFindingSearchInput" value="${escapeAttr(query)}" placeholder="z. B. P3, Randbewehrung, B-002, Mangel">
      </label>
      <div class="pin-search-results">
        ${query.trim()
          ? (results.length ? results.map(pinFindingResultCard).join("") : `<p class="muted">Keine Treffer für „${escapeHtml(query)}“.</p>`)
          : `<p class="muted">Suchbegriff eingeben, um Pins und Feststellungen in dieser Abnahme zu finden.</p>`}
      </div>
    </section>
  `;
}

function collectPinFindings() {
  if (!state.current) return [];
  const findings = [];
  (state.current.checkpoints || []).forEach((check) => {
    (check.samples || []).forEach((sample) => {
      const pin = sample.pinId ? state.current.pins.find((item) => item.id === sample.pinId) : null;
      if (!pin && !sampleHasDocumentation(sample)) return;
      const plan = pin ? planById(pin.planId) : null;
      findings.push({ check, sample, pin, plan });
    });
  });
  return findings;
}

function pinFindingSearchResults(query = "") {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return collectPinFindings().filter(({ check, sample, pin, plan }) => {
    const pinText = pin ? `${pinLabel(pin)} ${pin.id || ""}` : "";
    const haystack = [
      pinText,
      check.title,
      sample.location,
      sample.status,
      sample.followupStatus,
      sample.note,
      sample.followupNote,
      pin?.title,
      pin?.note,
      pin?.status,
      plan?.planNumber,
      plan?.appPlanName,
      plan?.title,
      plan?.fileName,
      plan?.planName
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(needle);
  });
}

function pinFindingResultCard({ check, sample, pin, plan }) {
  const note = (sample.note || sample.followupNote || pin?.note || "").trim();
  const shortNote = note.length > 140 ? `${note.slice(0, 137)}...` : note;
  const status = sample.followupStatus || sample.status || pin?.status || "offen / nicht bewertet";
  const photos = (sample.photos || []).length + (pin?.photos || []).length;
  const pinName = pin ? pinLabel(pin) : "ohne Pin";
  const planText = pin && plan ? `${plan.planNumber || plan.appPlanName || plan.fileName || "Plan"} / Seite ${pin.pageNumber || 1}` : "kein Planbezug";
  return `
    <article class="pin-search-card">
      <div class="pin-search-main">
        <strong>${escapeHtml(pinName)} · ${escapeHtml(check.title)}</strong>
        <span class="status-badge ${statusClassName(status)}">${escapeHtml(statusLabel(status))}</span>
      </div>
      <p class="muted">Prüfstelle ${escapeHtml(String(sample.number || ""))}${sample.location ? ` · ${escapeHtml(sample.location)}` : ""} · ${escapeHtml(planText)} · ${photos} Foto${photos === 1 ? "" : "s"}</p>
      ${shortNote ? `<p>${escapeHtml(shortNote)}</p>` : `<p class="muted">Keine Bemerkung vorhanden.</p>`}
      <div class="card-actions compact-actions">
        <button class="secondary-btn" type="button" data-open-pin-finding="${escapeAttr(sample.id)}">Öffnen</button>
        ${pin ? `<button class="secondary-btn" type="button" data-show-pin-finding="${escapeAttr(sample.id)}">Auf Plan anzeigen</button>` : ""}
        ${pin ? `<button class="secondary-btn" type="button" data-reassign-sample="${escapeAttr(sample.id)}">Verschieben / neu zuordnen</button>` : ""}
      </div>
    </article>
  `;
}

function openPinFinding(sampleId) {
  const sample = findSample(sampleId);
  const check = findCheckBySample(sampleId);
  if (!sample || !check) return;
  activateCheck(check, true);
  state.openCheckId = check.id;
  state.openSampleId = sample.id;
  renderChecklist();
  requestAnimationFrame(() => document.querySelector(`[data-sample="${CSS.escape(sample.id)}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
}

function showPinFindingOnPlan(sampleId) {
  const sample = findSample(sampleId);
  if (!sample?.pinId) return;
  state.selectedPinId = sample.pinId;
  openPlanMarkDialog(sample.id);
  requestAnimationFrame(() => {
    state.selectedPinId = sample.pinId;
    renderMarkPins();
    renderMarkPinSheet(sample.pinId);
  });
}

function openReassignSampleDialog(sampleId) {
  const sample = findSample(sampleId);
  const sourceCheck = findCheckBySample(sampleId);
  const pin = sample?.pinId ? state.current?.pins?.find((item) => item.id === sample.pinId) : null;
  if (!sample || !sourceCheck || !pin) return alert("Diese Feststellung hat keinen zugeordneten Pin.");
  state.reassignSampleId = sample.id;
  const dialog = ensureReassignDialog();
  const currentPlan = planById(pin.planId);
  dialog.innerHTML = `
    <form method="dialog" class="reassign-dialog-card">
      <div class="dialog-head">
        <h3>Feststellung ${escapeHtml(pinLabel(pin))} neu zuordnen</h3>
        <button class="icon-btn" value="cancel" type="submit" aria-label="Schließen">×</button>
      </div>
      <div class="reassign-current">
        <p><strong>Aktueller Bereich:</strong> ${escapeHtml(sourceCheck.title)}</p>
        <p><strong>Aktueller Status:</strong> ${escapeHtml(sample.followupStatus || sample.status || pin.status || "offen")}</p>
        <p><strong>Plan:</strong> ${escapeHtml(currentPlan?.planNumber || currentPlan?.appPlanName || currentPlan?.fileName || "ohne Plan")} / Seite ${escapeHtml(String(pin.pageNumber || 1))}</p>
        <p class="muted">Pinposition, Fotos und Bemerkung bleiben erhalten.</p>
      </div>
      <label>Neuer Prüfbereich / Prüfumfang
        <select id="reassignCheckSelect">
          ${(state.current.checkpoints || []).map((check) => `<option value="${escapeAttr(check.id)}" ${check.id === sourceCheck.id ? "selected" : ""}>${escapeHtml(check.title)}</option>`).join("")}
        </select>
      </label>
      <label>Ziel-Prüfstelle
        <select id="reassignSampleSelect"></select>
      </label>
      <label>Titel / Bereich / Achse optional anpassen
        <input id="reassignLocationInput" value="${escapeAttr(sample.location || pin.title || "")}" placeholder="z. B. Achse B/3">
      </label>
      <label>Notiz zur Neuzuordnung optional
        <textarea id="reassignNoteInput" rows="2" placeholder="z. B. versehentlich falschem Prüfbereich zugeordnet"></textarea>
      </label>
      <div class="dialog-actions">
        <button class="secondary-btn" value="cancel" type="submit">Abbrechen</button>
        <button class="primary-btn" id="confirmReassignSampleBtn" value="default" type="button">Verschieben</button>
      </div>
    </form>
  `;
  const checkSelect = dialog.querySelector("#reassignCheckSelect");
  checkSelect.addEventListener("change", renderReassignTargetSamples);
  dialog.querySelector("#confirmReassignSampleBtn").addEventListener("click", confirmSampleReassignment);
  renderReassignTargetSamples();
  dialog.showModal();
}

function ensureReassignDialog() {
  let dialog = document.getElementById("reassignSampleDialog");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "reassignSampleDialog";
    dialog.className = "app-dialog reassign-dialog";
    document.body.appendChild(dialog);
  }
  return dialog;
}

function renderReassignTargetSamples() {
  const dialog = document.getElementById("reassignSampleDialog");
  const target = dialog?.querySelector("#reassignSampleSelect");
  const checkId = dialog?.querySelector("#reassignCheckSelect")?.value || "";
  const currentSampleId = state.reassignSampleId;
  const check = state.current?.checkpoints?.find((item) => item.id === checkId);
  if (!target || !check) return;
  const options = [`<option value="__new__">neue Prüfstelle im Zielbereich anlegen</option>`].concat((check.samples || [])
    .filter((sample) => sample.id !== currentSampleId)
    .map((sample) => `<option value="${escapeAttr(sample.id)}">Prüfstelle ${escapeHtml(String(sample.number || ""))}${sample.location ? ` · ${escapeHtml(sample.location)}` : ""}${sample.pinId ? " · Pin vorhanden" : ""}</option>`));
  target.innerHTML = options.join("");
}

function confirmSampleReassignment() {
  const dialog = document.getElementById("reassignSampleDialog");
  const sample = findSample(state.reassignSampleId);
  const sourceCheck = findCheckBySample(state.reassignSampleId);
  const targetCheckId = dialog?.querySelector("#reassignCheckSelect")?.value || "";
  const targetChoice = dialog?.querySelector("#reassignSampleSelect")?.value || "__new__";
  const location = dialog?.querySelector("#reassignLocationInput")?.value.trim() || "";
  const note = dialog?.querySelector("#reassignNoteInput")?.value.trim() || "";
  const targetCheck = state.current?.checkpoints?.find((check) => check.id === targetCheckId);
  const pin = sample?.pinId ? state.current?.pins?.find((item) => item.id === sample.pinId) : null;
  if (!sample || !sourceCheck || !targetCheck || !pin) return;
  const targetTitle = targetCheck.title;
  if (!confirm(`${pinLabel(pin)} von ${sourceCheck.title} nach ${targetTitle} verschieben? Pinposition, Fotos und Bemerkung bleiben erhalten.`)) return;
  const moved = reassignSampleToCheck(sample, sourceCheck, targetCheck, targetChoice, { location, note });
  if (!moved) return;
  dialog?.close();
  showAppToast(`${pinLabel(pin)} wurde verschoben. Fotos, Pin und Bemerkung wurden übernommen.`, { type: "success" });
}

function reassignSampleToCheck(sample, sourceCheck, targetCheck, targetChoice = "__new__", options = {}) {
  const pin = state.current.pins.find((item) => item.id === sample.pinId);
  const timestamp = new Date().toISOString();
  const historyEntry = {
    moved_from_check_id: sourceCheck.id,
    moved_from_check_title: sourceCheck.title,
    moved_from_sample_id: sample.id,
    moved_from_sample_title: `Prüfstelle ${sample.number || ""}`.trim(),
    moved_to_check_id: targetCheck.id,
    moved_to_check_title: targetCheck.title,
    moved_at: timestamp,
    moved_by: "user",
    reassignment_note: options.note || ""
  };
  let targetSample = null;
  if (targetChoice && targetChoice !== "__new__") {
    targetSample = targetCheck.samples.find((item) => item.id === targetChoice) || null;
    if (targetSample?.pinId && targetSample.pinId !== sample.pinId) {
      alert("Die gewählte Ziel-Prüfstelle hat bereits einen anderen Pin. Bitte eine neue Ziel-Prüfstelle anlegen oder eine andere Prüfstelle wählen.");
      return false;
    }
  }
  sourceCheck.samples = (sourceCheck.samples || []).filter((item) => item.id !== sample.id);
  if (targetSample) {
    targetSample.status = sample.status || targetSample.status;
    targetSample.followupStatus = sample.followupStatus || targetSample.followupStatus;
    targetSample.note = mergeTextBlocks(targetSample.note || targetSample.followupNote || "", sample.note || sample.followupNote || "");
    targetSample.followupNote = isFollowupProtocol() ? targetSample.note : targetSample.followupNote;
    targetSample.location = options.location || sample.location || targetSample.location || "";
    targetSample.pinId = sample.pinId;
    targetSample.photos = mergePhotoRefs(targetSample.photos || [], sample.photos || []);
    targetSample.reassign_history = [...(targetSample.reassign_history || []), ...(sample.reassign_history || []), { ...historyEntry, moved_to_sample_id: targetSample.id, moved_to_sample_title: `Prüfstelle ${targetSample.number || ""}`.trim() }];
    targetSample.moved_from_check_id = sourceCheck.id;
    targetSample.moved_from_check_title = sourceCheck.title;
    targetSample.moved_to_check_id = targetCheck.id;
    targetSample.moved_to_check_title = targetCheck.title;
    targetSample.moved_at = timestamp;
    targetSample.moved_by = "user";
    targetSample.updatedAt = timestamp;
    sample = targetSample;
  } else {
    sample.checkItemId = targetCheck.id;
    sample.number = nextSampleNumber(targetCheck);
    sample.location = options.location || sample.location || "";
    sample.reassign_history = [...(sample.reassign_history || []), { ...historyEntry, moved_to_sample_id: sample.id, moved_to_sample_title: `Prüfstelle ${sample.number || ""}`.trim() }];
    sample.moved_from_check_id = sourceCheck.id;
    sample.moved_from_check_title = sourceCheck.title;
    sample.moved_to_check_id = targetCheck.id;
    sample.moved_to_check_title = targetCheck.title;
    sample.moved_at = timestamp;
    sample.moved_by = "user";
    sample.updatedAt = timestamp;
    targetCheck.samples.push(sample);
  }
  if (pin) {
    pin.checkItemId = targetCheck.id;
    pin.sampleId = sample.id;
    pin.title = options.location || sample.location || pin.title || targetCheck.title;
    pin.reassign_history = [...(pin.reassign_history || []), { ...historyEntry, moved_to_sample_id: sample.id, moved_to_sample_title: `Prüfstelle ${sample.number || ""}`.trim() }];
    pin.moved_from_check_id = sourceCheck.id;
    pin.moved_from_check_title = sourceCheck.title;
    pin.moved_from_sample_id = historyEntry.moved_from_sample_id;
    pin.moved_to_check_id = targetCheck.id;
    pin.moved_to_check_title = targetCheck.title;
    pin.moved_to_sample_id = sample.id;
    pin.moved_to_sample_title = `Prüfstelle ${sample.number || ""}`.trim();
    pin.moved_at = timestamp;
    pin.moved_by = "user";
    pin.updatedAt = timestamp;
  }
  activateCheck(targetCheck, true);
  updateCheckStatus(sourceCheck);
  updateCheckStatus(targetCheck);
  state.openCheckId = targetCheck.id;
  state.openSampleId = sample.id;
  state.selectedPinId = pin?.id || state.selectedPinId;
  state.current.updatedAt = timestamp;
  persist();
  renderChecklist();
  return true;
}

function mergeTextBlocks(existing = "", incoming = "") {
  const left = String(existing || "").trim();
  const right = String(incoming || "").trim();
  if (!left) return right;
  if (!right || left.includes(right)) return left;
  return `${left}\n\n${right}`;
}

function mergePhotoRefs(existing = [], incoming = []) {
  const map = new Map();
  [...existing, ...incoming].forEach((photo) => { if (photo?.id && !map.has(photo.id)) map.set(photo.id, photo); });
  return [...map.values()];
}
function sampleCard(check, sample) {
  if (isFollowupProtocol()) return followupSampleCard(check, sample);
  const isOpen = state.openSampleId === sample.id;
  return `
    <section class="sample-card ${isOpen ? "open" : "collapsed"} ${sampleVisualClass(sample)}" data-sample="${sample.id}">
      <button class="sample-toggle" type="button" data-toggle-sample-panel="${sample.id}" aria-expanded="${isOpen ? "true" : "false"}">
        <span class="sample-toggle-title">${escapeHtml(check.title)} - Prüfstelle ${sample.number}</span>
        <span class="sample-toggle-summary">${sampleSummary(sample, check)}</span>
      </button>
      ${isOpen ? `<div class="sample-detail">
        <div class="sample-title">
          <h4>${escapeHtml(check.title)} - Prüfstelle ${sample.number}</h4>
          <span class="sample-status ${statusClass(sample.status).replace("status ", "status-")}">${escapeHtml(sample.status)}</span>
        </div>
        ${comboField({ label: "Bereich / Achse / Bauteil", field: "location", list: "areaOptions", value: sample.location, placeholder: "z. B. Achse A/3, Bodenplatte Unterfahrt", dataAttr: "data-sample-field" })}
        ${statusButtons(sample.status, "sample-status")}
        <label>Pin zuordnen
          <select data-sample-field="pinId">${pinOptionsHtml()}</select>
        </label>
        <p class="muted">${escapeHtml(samplePinMeta(sample))}</p>
        ${samplePlanMarkControls(check, sample)}
        <label class="voice-field">Bemerkung
          <textarea data-sample-field="note" rows="3">${escapeHtml(sample.note)}</textarea>
          <button class="mic-btn" type="button" data-voice-sample="${sample.id}">Mikrofon</button>
        </label>
        ${isOverlapCheckItem(check) ? overlapCheckBlock(sample) : ""}
        ${samplePhotoGrid(sample)}
        <div class="sample-actions">
          <button class="secondary-btn" type="button" data-photo-sample-camera="${sample.id}">Foto aufnehmen</button>
          <button class="secondary-btn" type="button" data-photo-sample-gallery="${sample.id}">Foto aus Galerie auswählen</button>
          <button class="small-btn" type="button" data-duplicate-sample="${sample.id}">Prüfstelle duplizieren</button>
          <button class="danger-btn" type="button" data-delete-sample="${sample.id}">Löschen</button>
        </div>
      </div>` : ""}
    </section>
  `;
}

function followupSampleCard(check, sample) {
  const isNew = isNewFollowupSample(check, sample);
  const sourceStatus = sample.sourceStatus || initialSampleStatus(sample) || "offen";
  const currentStatus = sample.followupStatus || sample.status || (isNew ? "neu hinzugekommen" : "weiterhin offen");
  const isOpen = state.openSampleId === sample.id;
  return `
    <section class="sample-card ${isNew ? "followup-new-sample" : ""} ${isOpen ? "open" : "collapsed"} ${sampleVisualClass(sample)}" data-sample="${sample.id}">
      <button class="sample-toggle" type="button" data-toggle-sample-panel="${sample.id}" aria-expanded="${isOpen ? "true" : "false"}">
        <span class="sample-toggle-title">${escapeHtml(check.title)} - ${isNew ? "Neu in dieser Nachbegehung" : `Nachkontrolle ${sample.number}`}</span>
        <span class="sample-toggle-summary">${sampleSummary(sample, check, currentStatus)}</span>
      </button>
      ${isOpen ? `<div class="sample-detail">
        <div class="sample-title">
          <h4>${escapeHtml(check.title)} - ${isNew ? "Neu in dieser Nachbegehung" : `Nachkontrolle ${sample.number}`}</h4>
          ${statusBadge(currentStatus)}
        </div>
        ${isNew ? `<div class="followup-new-note"><strong>Neu festgestellt in Nachbegehung</strong><p class="muted">Dieser Prüfpunkt wurde erst in dieser Nachbegehung ergänzt.</p></div>` : `<div class="followup-reference">
          <strong>Referenz aus Erstabnahme</strong>
          <p>${statusBadge(sourceStatus)} ${escapeHtml(sample.location || "ohne Bereich")}${sample.pinId ? " · " + escapeHtml(samplePinMeta(sample)) : ""}</p>
          ${sample.sourceNote ? `<p>${escapeHtml(sample.sourceNote)}</p>` : `<p class="muted">Keine Referenzbemerkung vorhanden.</p>`}
          ${sample.referencePhotos?.length ? `<p class="muted">Referenzfotos: ${sample.referencePhotos.length}</p>${thumbs(sample.referencePhotos)}` : ""}
        </div>`}
        ${comboField({ label: "Bereich / Achse / Bauteil", field: "location", list: "areaOptions", value: sample.location, placeholder: "z. B. Achse A/3, Bodenplatte Unterfahrt", dataAttr: "data-sample-field" })}
        <div class="status-row followup-status-row">${FOLLOWUP_STATUSES.map((status) => `
          <button class="status-btn ${currentStatus === status ? "active" : ""}" data-followup-status="${status}" type="button">${escapeHtml(status)}</button>
        `).join("")}</div>
        <label>Pin zuordnen
          <select data-sample-field="pinId">${pinOptionsHtml()}</select>
        </label>
        <p class="muted">${escapeHtml(samplePinMeta(sample))}</p>
        ${samplePlanMarkControls(check, sample)}
        <label class="voice-field">Neue Bemerkung Nachbegehung
          <textarea data-sample-field="note" rows="3">${escapeHtml(sample.note || sample.followupNote || "")}</textarea>
          <button class="mic-btn" type="button" data-voice-sample="${sample.id}">Mikrofon</button>
        </label>
        ${samplePhotoGrid(sample)}
        <div class="sample-actions">
          <button class="secondary-btn" type="button" data-photo-sample-camera="${sample.id}">Foto aufnehmen</button>
          <button class="secondary-btn" type="button" data-photo-sample-gallery="${sample.id}">Foto aus Galerie auswählen</button>
          <button class="danger-btn" type="button" data-delete-sample="${sample.id}">Löschen</button>
        </div>
      </div>` : ""}
    </section>
  `;
}

function isOverlapCheckItem(check) {
  return (check?.title || "").toLowerCase().includes("übergreifung");
}

function overlapCheckBlock(sample) {
  const check = sample.overlapCheck;
  const open = sample.overlapCheckOpen || !!check;
  return `
    <div class="overlap-box">
      <button class="secondary-btn" type="button" data-toggle-overlap="${sample.id}">Übergreifung prüfen/berechnen</button>
      ${open ? overlapForm(sample, check || defaultOverlapCheck(sample)) : ""}
    </div>
  `;
}

function overlapForm(sample, check) {
  const calc = calculateOverlap(check, sample);
  const diameter = getOverlapDiameter(check);
  return `
    <div class="overlap-form" data-overlap-form="${sample.id}">
      <p class="overlap-warning">Hinweis: Maßgebend bleiben freigegebene Statik, Bewehrungsplan und DIN EN 1992-1-1 mit Nationalem Anhang. Diese Berechnung dient nur der dokumentierten Kontrolle im Rahmen der Bewehrungsabnahme.</p>
      ${overlapMessages(calc)}
      <label>Modus
        <select data-overlap-field="mode">
          <option value="${OVERLAP_PLAN_MODE}" ${check.mode === OVERLAP_PLAN_MODE ? "selected" : ""}>Sollwert laut Plan</option>
          <option value="${OVERLAP_EC2_MODE}" ${check.mode === OVERLAP_EC2_MODE ? "selected" : ""}>Berechnung nach EC2/NA</option>
        </select>
      </label>
      ${diameterField(check, diameter)}
      ${check.mode === OVERLAP_PLAN_MODE ? overlapPlanFields(check) : overlapEc2Fields(check)}
      <label>Bemerkung / Auflage
        <textarea data-overlap-field="note" rows="2">${escapeHtml(check.note || "")}</textarea>
      </label>
      <div class="overlap-result">
        <strong>${escapeHtml(calc.resultTitle)}</strong>
        <div class="overlap-summary-grid">
          <span>Erforderlich <b>${escapeHtml(formatMmCm(calc.requiredMm || calc.requiredFromPlanMm))}</b></span>
          <span>Vorhanden <b>${escapeHtml(formatApproxMmCm(calc.measuredMm))}</b></span>
          <span>Differenz <b>${escapeHtml(formatDifference(calc.differenceMm))}</b></span>
          <span>Bewertung <b>${escapeHtml(statusLabel(calc.resultStatus))}</b></span>
        </div>
        <p>${escapeHtml(calc.summary)}</p>
        <details class="overlap-details">
          <summary>Rechenweg / Dokumentation</summary>
          <pre>${escapeHtml(calc.calculationText)}</pre>
        </details>
      </div>
      <div class="sample-actions">
        <button class="small-btn" type="button" data-calc-overlap="${sample.id}">Berechnen</button>
        <button class="primary-btn" type="button" data-apply-overlap="${sample.id}">In Prüfstelle übernehmen</button>
      </div>
    </div>
  `;
}

function overlapPlanFields(check) {
  return `
    <div class="grid compact-grid">
      <label>Soll-Übergreifung laut Plan
        <input data-overlap-field="requiredFromPlanValue" type="number" min="0" inputmode="decimal" value="${escapeAttr(mmToUnitValue(check.requiredFromPlanMm, check.requiredFromPlanUnit || "cm"))}" placeholder="z. B. 80">
      </label>
      <label>Einheit Soll
        <select data-overlap-field="requiredFromPlanUnit">
          <option value="cm" ${(check.requiredFromPlanUnit || "cm") === "cm" ? "selected" : ""}>cm</option>
          <option value="mm" ${check.requiredFromPlanUnit === "mm" ? "selected" : ""}>mm</option>
        </select>
      </label>
      <label>Vorhanden / gemessen
        <input data-overlap-field="measuredValue" type="number" min="0" inputmode="decimal" value="${escapeAttr(mmToUnitValue(check.measuredMm, check.measuredUnit || "cm"))}" placeholder="z. B. 75">
      </label>
      <label>Einheit vorhanden
        <select data-overlap-field="measuredUnit">
          <option value="cm" ${(check.measuredUnit || "cm") === "cm" ? "selected" : ""}>cm</option>
          <option value="mm" ${check.measuredUnit === "mm" ? "selected" : ""}>mm</option>
        </select>
      </label>
    </div>
  `;
}

function diameterField(check, diameter) {
  const presets = ["6", "8", "10", "12", "14", "16", "20", "25", "28", "32"];
  const selectedMode = check.diameterMode || (presets.includes(String(diameter)) ? String(diameter) : "custom");
  return `
    <div class="overlap-field-group">
      <label>Stabdurchmesser Ø
        <select data-overlap-field="diameterMode">
          ${presets.map((item) => `<option value="${item}" ${selectedMode === item ? "selected" : ""}>Ø ${item} mm</option>`).join("")}
          <option value="custom" ${selectedMode === "custom" ? "selected" : ""}>freie Eingabe</option>
        </select>
      </label>
      ${selectedMode === "custom" ? `<label>Freier Stabdurchmesser mm<input data-overlap-field="diameterCustomMm" type="number" min="1" max="40" inputmode="decimal" value="${escapeAttr(check.diameterCustomMm || diameter || "")}" placeholder="z. B. 18"></label>` : ""}
      <small>Standard Ø12. Erlaubt sind Werte größer 0 bis maximal 40 mm.</small>
    </div>
  `;
}

function overlapMessages(calc) {
  const messages = [].concat(calc.validationErrors || [], calc.validationWarnings || []);
  if (!messages.length) return "";
  return `<div class="overlap-errors">${messages.map((message) => `<p>${escapeHtml(message)}</p>`).join("")}</div>`;
}

function overlapEc2Fields(check) {
  return `
    <button class="small-btn" type="button" data-overlap-conservative>Konservative Standardannahmen verwenden</button>
    <div class="grid compact-grid">
      <label>Betonfestigkeitsklasse
        <select data-overlap-field="concreteClass">${Object.keys(EC2_NA_CONFIG.concrete).map((item) => `<option value="${item}" ${check.concreteClass === item ? "selected" : ""}>${item}</option>`).join("")}</select>
      </label>
      <label>Betonstahl<input data-overlap-field="steelGrade" value="${escapeAttr(check.steelGrade || "B500B")}"></label>
      <label>Verbundbedingungen
        <select data-overlap-field="bondCondition">
          <option value="good" ${check.bondCondition === "good" ? "selected" : ""}>gut</option>
          <option value="moderate" ${check.bondCondition === "moderate" ? "selected" : ""}>mäßig</option>
          <option value="unknown" ${check.bondCondition === "unknown" ? "selected" : ""}>unbekannt</option>
        </select>
      </label>
      <label>Beanspruchung
        <select data-overlap-field="stressType">
          <option value="tension" ${check.stressType === "tension" ? "selected" : ""}>Zugstoß</option>
          <option value="compression" ${check.stressType === "compression" ? "selected" : ""}>Druckstoß</option>
          <option value="unknown" ${check.stressType === "unknown" ? "selected" : ""}>unbekannt</option>
        </select>
      </label>
      <label>Anteil gestoßener Stäbe
        <select data-overlap-field="spliceRatio">
          <option value="le25" ${check.spliceRatio === "le25" ? "selected" : ""}>≤25 %</option>
          <option value="p33" ${check.spliceRatio === "p33" ? "selected" : ""}>33 %</option>
          <option value="p50" ${check.spliceRatio === "p50" ? "selected" : ""}>50 %</option>
          <option value="gt50" ${check.spliceRatio === "gt50" ? "selected" : ""}>>50 %</option>
          <option value="unknown" ${check.spliceRatio === "unknown" ? "selected" : ""}>unbekannt</option>
        </select>
      </label>
      <label>σsd
        <select data-overlap-field="sigmaMode">
          <option value="fyd" ${check.sigmaMode === "fyd" ? "selected" : ""}>konservativ fyd verwenden</option>
          <option value="custom" ${check.sigmaMode === "custom" ? "selected" : ""}>reduzierte Stahlspannung manuell eingeben</option>
          <option value="from_plan" ${check.sigmaMode === "from_plan" ? "selected" : ""}>aus Statik/Plan übernommen</option>
        </select>
      </label>
      ${check.sigmaMode !== "fyd" ? `<label>σsd N/mm²<input data-overlap-field="sigmaSd" type="number" min="1" inputmode="decimal" value="${escapeAttr(check.sigmaSd)}" placeholder="z. B. 350"></label>` : ""}
      <label>Vorhanden / gemessen
        <input data-overlap-field="measuredValue" type="number" min="0" inputmode="decimal" value="${escapeAttr(mmToUnitValue(check.measuredMm, check.measuredUnit || "cm"))}" placeholder="z. B. 75">
      </label>
      <label>Einheit vorhanden
        <select data-overlap-field="measuredUnit">
          <option value="cm" ${(check.measuredUnit || "cm") === "cm" ? "selected" : ""}>cm</option>
          <option value="mm" ${check.measuredUnit === "mm" ? "selected" : ""}>mm</option>
        </select>
      </label>
    </div>
    <details class="overlap-details">
      <summary>Erweiterte Annahmen</summary>
      ${overlapAdvancedFields(check)}
    </details>
  `;
}

function overlapAdvancedFields(check) {
  return `
    <p class="muted">Diese Angaben werden im PDF dokumentiert. Unbekannte Werte bleiben konservativ.</p>
    <div class="grid compact-grid">
      <label>As,erf / As,vorh
        <select data-overlap-field="asRatioMode">
          <option value="1" ${check.asRatioMode === "1" ? "selected" : ""}>1,0 konservativ</option>
          <option value="0.8" ${check.asRatioMode === "0.8" ? "selected" : ""}>0,8 laut Plan/Statik</option>
          <option value="0.7" ${check.asRatioMode === "0.7" ? "selected" : ""}>0,7 laut Plan/Statik</option>
          <option value="0.6" ${check.asRatioMode === "0.6" ? "selected" : ""}>0,6 laut Plan/Statik</option>
          <option value="manual" ${check.asRatioMode === "manual" ? "selected" : ""}>manuell</option>
        </select>
      </label>
      ${check.asRatioMode === "manual" ? `<label>As-Verhältnis manuell<input data-overlap-field="asReqAsProv" type="number" min="0.1" max="1" step="0.01" inputmode="decimal" value="${escapeAttr(check.asReqAsProv)}"></label>` : ""}
      ${alphaSelect("alpha1", "Stabform", check.alpha1Mode, check.alpha1, [["conservative", "gerader Stab / konservativ 1,0"], ["manual", "abweichend laut Statik/Plan"]])}
      ${alphaSelect("alpha2", "Betondeckung", check.alpha2Mode, check.alpha2, [["conservative", "konservativ 1,0"], ["manual", "abweichend laut Statik/Plan"]])}
      ${alphaSelect("alpha3", "Querbewehrung", check.alpha3Mode, check.alpha3, [["conservative", "konservativ 1,0"], ["manual", "abweichend laut Statik/Plan"]])}
      ${alphaSelect("alpha5", "Querdruck", check.alpha5Mode, check.alpha5, [["conservative", "kein Ansatz / 1,0"], ["manual", "Querdruck laut Statik/Plan"]])}
    </div>
  `;
}

function alphaSelect(field, label, mode, value, options) {
  return `
    <label>${label}
      <select data-overlap-field="${field}Mode">
        ${options.map(([optionValue, text]) => `<option value="${optionValue}" ${mode === optionValue ? "selected" : ""}>${text}</option>`).join("")}
      </select>
    </label>
    ${mode === "manual" ? `<label>${label} Beiwert<input data-overlap-field="${field}" type="number" min="0.1" max="1.5" step="0.01" inputmode="decimal" value="${escapeAttr(value)}"></label>` : ""}
  `;
}

function pinOptionsHtml() {
  return [`<option value="">kein Pin</option>`].concat(
    state.current.pins.map((pin) => {
      const plan = planById(pin.planId);
      return `<option value="${pin.id}">${pinLabel(pin)} · ${escapeHtml(plan?.planNumber || plan?.fileName || "Plan")} / S.${pin.pageNumber} ${escapeHtml(pin.title || "")}</option>`;
    })
  ).join("");
}

function samplePlanMarkControls(check, sample) {
  const pin = sample.pinId ? state.current.pins.find((item) => item.id === sample.pinId) : null;
  const plan = pin ? planById(pin.planId) : null;
  if (!pin) {
    return `
      <div class="sample-mark-box">
        <p class="muted">Kein Pin gesetzt.</p>
        <button class="primary-btn" type="button" data-mark-sample="${sample.id}">Auf Plan markieren</button>
      </div>
    `;
  }
  return `
    <div class="sample-mark-box">
      <p><strong>Planmarkierung vorhanden</strong><br>
      <span class="muted">Markiert auf Plan ${escapeHtml(plan?.planNumber || plan?.fileName || "Plan")}, Seite ${pin.pageNumber || sample.pageNumber || 1}, ${escapeHtml(pinLabel(pin))}</span></p>
      <div class="sample-actions">
        <button class="secondary-btn" type="button" data-show-sample-pin="${sample.id}">Anzeigen</button>
        <button class="secondary-btn" type="button" data-mark-sample="${sample.id}">Neu setzen</button>
        <button class="danger-btn" type="button" data-remove-sample-pin="${sample.id}">Entfernen</button>
      </div>
    </div>
  `;
}

function samplePinMeta(sample) {
  if (!sample.pinId) return "Kein Pin zugeordnet.";
  const pin = state.current.pins.find((item) => item.id === sample.pinId);
  const plan = pin ? planById(pin.planId) : null;
  return pin && plan ? `${pinLabel(pin)} · ${plan.planNumber || plan.fileName} · Seite ${pin.pageNumber}` : "Zugeordneter Pin nicht gefunden.";
}

function photosForSampleOrPin(sample = {}) {
  const pin = sample.pinId ? state.current?.pins?.find((item) => item.id === sample.pinId) : null;
  const direct = sample.photos || [];
  const viaPin = pin?.photos || [];
  return uniquePhotoRefs([...direct, ...viaPin]).map((photo) => ({
    ...photo,
    _source: direct.some((item) => item.id === photo.id) ? "sample" : "pin"
  }));
}

function samplePhotoGrid(sample) {
  const photos = photosForSampleOrPin(sample);
  if (!photos.length) return `<p class="muted">Noch keine Fotos in dieser Prüfstelle.</p>`;
  const hasPinPhotos = photos.some((photo) => photo._source === "pin");
  return `${hasPinPhotos ? `<p class="muted">Fotos aus Pin-Zuordnung übernommen.</p>` : ""}<div class="thumb-row">${photos.map((photo) => `
    <figure class="sample-photo">
      <img class="thumb" data-photo-thumb="${photo.id}" alt="${escapeAttr(photo.name || "Foto")}">
      ${photo._source === "pin" ? `<small class="muted">Pin-Foto</small>` : ""}
      ${barCountSummary(photo)}
      ${photoBackupActions(photo)}
      <button class="small-btn" type="button" data-bar-count-photo="${photo.id}">Stäbe zählen (Beta)</button>
      ${photo._source === "sample" ? `<button class="danger-btn" type="button" data-delete-sample-photo="${sample.id}" data-photo-id="${photo.id}">Foto löschen</button>` : ""}
    </figure>
  `).join("")}</div>`;
}
function defaultOverlapCheck(sample = {}) {
  return {
    mode: OVERLAP_PLAN_MODE,
    diameterMode: "12",
    diameterCustomMm: "",
    diameterMm: 12,
    concreteClass: "C25/30",
    steelGrade: "B500B",
    bondCondition: "unknown",
    stressType: "unknown",
    spliceRatio: "unknown",
    sigmaMode: "fyd",
    sigmaSd: "",
    asRatioMode: "1",
    asReqAsProv: 1,
    alpha1Mode: "conservative",
    alpha2Mode: "conservative",
    alpha3Mode: "conservative",
    alpha5Mode: "conservative",
    alpha1: 1,
    alpha2: 1,
    alpha3: 1,
    alpha5: 1,
    alpha6: "",
    requiredFromPlanMm: "",
    requiredFromPlanUnit: "cm",
    measuredMm: "",
    measuredUnit: "cm",
    resultStatus: "",
    differenceMm: "",
    planId: sample.planId || "",
    pageNumber: sample.pageNumber || 1,
    pinId: sample.pinId || "",
    note: "",
    generatedText: ""
  };
}

function calculateOverlap(input, sample) {
  const check = normalizeOverlapCheck(input || defaultOverlapCheck(sample));
  return check.mode === OVERLAP_EC2_MODE ? calculateOverlapEc2(check, sample) : calculateOverlapPlanValue(check, sample);
}

function getOverlapDiameter(check) {
  if (!check) return 12;
  return check.diameterMode === "custom" ? asNumber(check.diameterCustomMm) : asNumber(check.diameterMode || check.diameterMm || 12);
}

function overlapValidation(check) {
  const errors = [];
  const warnings = [];
  const diameter = getOverlapDiameter(check);
  const measured = asNumber(check.measuredMm);
  const requiredPlan = asNumber(check.requiredFromPlanMm);
  if (!diameter || diameter <= 0 || diameter > 40) errors.push("Bitte gültigen Stabdurchmesser eingeben.");
  if (measured !== "" && measured < 0) errors.push("Bitte gültige vorhandene/gemessene Übergreifungslänge eingeben.");
  if (measured === 0) warnings.push("Vorhandene/gemessene Länge ist 0: Bitte Eingabe prüfen.");
  if (check.mode === OVERLAP_PLAN_MODE && requiredPlan !== "" && requiredPlan <= 0) errors.push("Bitte gültige Soll-Übergreifung laut Plan eingeben.");
  if (check.mode === OVERLAP_EC2_MODE) {
    if (["custom", "from_plan"].includes(check.sigmaMode) && asNumber(check.sigmaSd) <= 0) errors.push("Bitte gültige Stahlspannung σsd eingeben oder konservativ fyd verwenden.");
    if (asNumber(check.asReqAsProv) <= 0 || asNumber(check.asReqAsProv) > 1) errors.push("Bitte gültiges Verhältnis As,erf / As,vorh zwischen 0 und 1 eingeben.");
    ["alpha1", "alpha2", "alpha3", "alpha5"].forEach((field) => {
      const value = asNumber(check[field]);
      if (value <= 0 || value > 1.5) errors.push(`Bitte gültigen Beiwert ${field.replace("alpha", "α")} eingeben.`);
    });
  }
  if (measured === "") warnings.push("Keine gemessene Länge eingetragen: Bewertung bleibt Klärung.");
  return { errors, warnings, diameter };
}

function calculateOverlapPlanValue(check, sample) {
  const validation = overlapValidation(check);
  const diameter = validation.diameter;
  const required = asNumber(check.requiredFromPlanMm);
  const measured = asNumber(check.measuredMm);
  let status = "teilweise / Auflage";
  let title = "Klärung erforderlich";
  if (!validation.errors.length && required && measured !== "") {
    status = measured >= required ? "fertig / OK" : "nicht OK / Mangel";
    title = measured >= required ? "augenscheinlich ausreichend" : "nicht ausreichend";
  }
  const diff = !validation.errors.length && required && measured !== "" ? measured - required : "";
  const generated = planValueGeneratedText({ diameter, required, measured, status });
  return {
    ...check,
    mode: OVERLAP_PLAN_MODE,
    diameterMm: diameter || "",
    differenceMm: diff,
    resultStatus: status,
    requiredMm: required || "",
    generatedText: generated,
    resultTitle: `Bewertung: ${title}`,
    summary: generated,
    calculationText: [
      "Modus: Sollwert laut Plan",
      `Planbezug: ${pinName(sample.pinId) || "ohne Pin"}`,
      `Stabdurchmesser: Ø${diameter || "?"} mm`,
      `Sollwert: ${formatMmCm(required)}`,
      `Vorhanden/gemessen: ${formatMmCm(measured)}`,
      `Differenz: ${formatDifference(diff)}`,
      validation.errors.length ? `Validierung: ${validation.errors.join(" ")}` : "",
      validation.warnings.length ? `Hinweis: ${validation.warnings.join(" ")}` : ""
    ].filter(Boolean).join("\n"),
    validationErrors: validation.errors,
    validationWarnings: validation.warnings
  };
}

function calculateOverlapEc2(check, sample) {
  const validation = overlapValidation(check);
  const diameter = validation.diameter;
  const concrete = EC2_NA_CONFIG.concrete[check.concreteClass] || EC2_NA_CONFIG.concrete["C25/30"];
  const gammaC = EC2_NA_CONFIG.gammaC;
  const alphaCt = EC2_NA_CONFIG.alphaCt;
  const fctk005 = concrete.fctk005;
  const fctd = alphaCt * fctk005 / gammaC;
  const eta1 = EC2_NA_CONFIG.eta1[check.bondCondition] ?? EC2_NA_CONFIG.eta1.unknown;
  const eta2 = diameter && !validation.errors.length ? (diameter <= 32 ? 1 : (132 - diameter) / 100) : "";
  const fbd = diameter && !validation.errors.length ? 2.25 * eta1 * eta2 * fctd : "";
  const fyd = EC2_NA_CONFIG.fyk / EC2_NA_CONFIG.gammaS;
  const sigmaSd = ["custom", "from_plan"].includes(check.sigmaMode) && asNumber(check.sigmaSd) ? asNumber(check.sigmaSd) : fyd;
  const asRatio = numberOrDefault(check.asReqAsProv, 1);
  const alpha1 = numberOrDefault(check.alpha1, 1);
  const alpha2 = numberOrDefault(check.alpha2, 1);
  const alpha3 = numberOrDefault(check.alpha3, 1);
  const alpha5 = numberOrDefault(check.alpha5, 1);
  const alpha6 = EC2_NA_CONFIG.alpha6[check.spliceRatio] ?? EC2_NA_CONFIG.alpha6.unknown;
  const lbRqd = diameter && fbd ? (diameter / 4) * (sigmaSd / fbd) * asRatio : "";
  const l0 = lbRqd ? alpha1 * alpha2 * alpha3 * alpha5 * alpha6 * lbRqd : "";
  const l0Min = lbRqd ? Math.max(0.3 * alpha6 * lbRqd, 15 * diameter, 200) : "";
  const required = l0 ? Math.max(l0, l0Min) : "";
  const measured = asNumber(check.measuredMm);
  let status = "teilweise / Auflage";
  if (!validation.errors.length && required && measured !== "") status = measured >= required ? "fertig / OK" : "nicht OK / Mangel";
  const diff = !validation.errors.length && required && measured !== "" ? measured - required : "";
  const calc = {
    ...check,
    mode: OVERLAP_EC2_MODE,
    diameterMm: diameter || "",
    fctk005,
    gammaC,
    alphaCt,
    fctd,
    eta1,
    eta2,
    fbd,
    sigmaSd,
    asReqAsProv: asRatio,
    alpha1,
    alpha2,
    alpha3,
    alpha5,
    alpha6,
    lbRqd,
    l0,
    l0Min,
    requiredMm: required,
    measuredMm: measured,
    differenceMm: diff,
    resultStatus: status,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings
  };
  calc.generatedText = ec2GeneratedText(calc);
  return {
    ...calc,
    resultTitle: `Bewertung: ${statusLabel(status)}`,
    summary: calc.generatedText,
    calculationText: ec2CalculationText(calc)
  };
}

function planValueGeneratedText({ diameter, required, measured, status }) {
  const prefix = `Übergreifungslänge Ø${diameter || "?"} geprüft. Soll laut Bewehrungsplan: ${formatMmCm(required)}. Vor Ort vorhanden/gemessen: ${formatApproxMmCm(measured)}.`;
  if (status === "fertig / OK") return `${prefix} Bewertung: augenscheinlich ausreichend.`;
  if (status === "nicht OK / Mangel") return `${prefix} Bewertung: nicht ausreichend. Übergreifung vor Betonage nachzuarbeiten bzw. mit Planer/Prüfingenieur zu klären.`;
  return `${prefix} Bewertung: teilweise / Klärung, da Sollwert oder vorhandener Wert fehlt.`;
}

function ec2GeneratedText(calc) {
  return `Übergreifungslänge Ø${calc.diameterMm || "?"} nach EC2/NA berechnet. Beton ${calc.concreteClass}, ${calc.steelGrade || "B500B"}, ${bondLabel(calc.bondCondition)}, σsd = ${round(calc.sigmaSd)} N/mm², As,erf/As,vorh = ${round(calc.asReqAsProv)}, α6 = ${round(calc.alpha6)}. Erforderlich l0,erf = ${formatMmCm(calc.requiredMm)}. Vorhanden/gemessen ca. ${formatApproxMmCm(calc.measuredMm)}. Bewertung: ${statusLabel(calc.resultStatus)}.`;
}

function ec2CalculationText(calc) {
  return [
    "Modus: Berechnung nach EC2/NA",
    "Hinweis: Die Berechnung dient der dokumentierten Kontrolle im Rahmen der Bewehrungsabnahme. Maßgebend bleiben freigegebene Statik, Bewehrungsplan sowie DIN EN 1992-1-1 mit Nationalem Anhang.",
    calc.validationErrors?.length ? `Validierung: ${calc.validationErrors.join(" ")}` : "",
    calc.validationWarnings?.length ? `Hinweis: ${calc.validationWarnings.join(" ")}` : "",
    `Stabdurchmesser: Ø${calc.diameterMm || "?"} mm, Betonstahl: ${calc.steelGrade || "B500B"}, σsd-Modus: ${sigmaModeLabel(calc.sigmaMode)}`,
    `fctk,0.05 = ${round(calc.fctk005)} N/mm², γc = ${round(calc.gammaC)}, αct = ${round(calc.alphaCt)}`,
    `fctd = αct * fctk,0.05 / γc = ${round(calc.fctd)} N/mm²`,
    `fbd = 2,25 * η1 * η2 * fctd = ${round(calc.fbd)} N/mm² (η1=${round(calc.eta1)}, η2=${round(calc.eta2)})`,
    `lb,rqd = (Ø / 4) * (σsd / fbd) * (As,erf / As,vorh) = ${formatMmCm(calc.lbRqd)}`,
    `l0 = α1 * α2 * α3 * α5 * α6 * lb,rqd = ${formatMmCm(calc.l0)}`,
    `l0,min = max(0,3 * α6 * lb,rqd, 15 * Ø, 200 mm) = ${formatMmCm(calc.l0Min)}`,
    `l0,erf = max(l0, l0,min) = ${formatMmCm(calc.requiredMm)}`,
    `Vorhanden/gemessen = ${formatApproxMmCm(calc.measuredMm)}, Differenz = ${formatDifference(calc.differenceMm)}`
  ].filter(Boolean).join("\n");
}

function applyOverlapToSample(sampleId) {
  const sample = findSample(sampleId);
  if (!sample) return;
  const calc = calculateOverlap(sample.overlapCheck || defaultOverlapCheck(sample), sample);
  if (calc.validationErrors?.length) {
    sample.overlapCheck = persistableOverlapCalc(calc, sample);
    sample.overlapCheckOpen = true;
    persist();
    renderChecklist();
    return;
  }
  sample.overlapCheck = persistableOverlapCalc(calc, sample);
  sample.status = calc.resultStatus;
  sample.note = [sample.overlapCheck.generatedText, sample.overlapCheck.note].filter(Boolean).join(" ");
  if (sample.pinId) {
    const pin = state.current.pins.find((item) => item.id === sample.pinId);
    const placement = pin ? (pinPlacements(pin).find((item) => item.isPrimary) || pinPlacements(pin)[0]) : null;
    sample.overlapCheck.planId = placement?.planId || pin?.planId || sample.planId || "";
    sample.overlapCheck.pageNumber = placement?.pageNumber || pin?.pageNumber || sample.pageNumber || 1;
    sample.overlapCheck.pinId = sample.pinId;
  }
  sample.updatedAt = new Date().toISOString();
  const check = findCheckBySample(sampleId);
  if (check) updateCheckStatus(check);
  persist();
  renderChecklist();
}

function persistableOverlapCalc(calc, sample) {
  const copy = { ...calc };
  delete copy.resultTitle;
  delete copy.summary;
  delete copy.calculationText;
  delete copy.validationErrors;
  delete copy.validationWarnings;
  copy.planId = sample.planId || copy.planId || "";
  copy.pageNumber = sample.pageNumber || copy.pageNumber || 1;
  copy.pinId = sample.pinId || copy.pinId || "";
  return copy;
}

function conservativeOverlapAssumptions(check) {
  return persistableOverlapCalc(calculateOverlap({
    ...normalizeOverlapCheck(check),
    bondCondition: "unknown",
    stressType: "tension",
    spliceRatio: "unknown",
    sigmaMode: "fyd",
    sigmaSd: "",
    asRatioMode: "1",
    asReqAsProv: 1,
    alpha1Mode: "conservative",
    alpha2Mode: "conservative",
    alpha3Mode: "conservative",
    alpha5Mode: "conservative",
    alpha1: 1,
    alpha2: 1,
    alpha3: 1,
    alpha5: 1
  }), {});
}

function updateOverlapField(check, field, value) {
  const updated = { ...normalizeOverlapCheck(check) };
  if (field === "mode") {
    updated.mode = value;
  } else if (field === "diameterMode") {
    updated.diameterMode = value;
    if (value !== "custom") updated.diameterMm = asNumber(value);
  } else if (field === "diameterCustomMm") {
    updated.diameterCustomMm = numberOrEmpty(value);
    updated.diameterMm = updated.diameterCustomMm;
  } else if (field === "requiredFromPlanValue") {
    updated.requiredFromPlanMm = unitToMm(value, updated.requiredFromPlanUnit || "cm");
  } else if (field === "requiredFromPlanUnit") {
    const currentValue = mmToUnitValue(updated.requiredFromPlanMm, updated.requiredFromPlanUnit || "cm");
    updated.requiredFromPlanUnit = value;
    updated.requiredFromPlanMm = unitToMm(currentValue, value);
  } else if (field === "measuredValue") {
    updated.measuredMm = unitToMm(value, updated.measuredUnit || "cm");
  } else if (field === "measuredUnit") {
    const currentValue = mmToUnitValue(updated.measuredMm, updated.measuredUnit || "cm");
    updated.measuredUnit = value;
    updated.measuredMm = unitToMm(currentValue, value);
  } else if (field === "sigmaMode") {
    updated.sigmaMode = value;
    if (value === "fyd") updated.sigmaSd = "";
  } else if (field === "asRatioMode") {
    updated.asRatioMode = value;
    if (value !== "manual") updated.asReqAsProv = asNumber(value);
  } else if (["alpha1Mode", "alpha2Mode", "alpha3Mode", "alpha5Mode"].includes(field)) {
    updated[field] = value;
    const alphaField = field.replace("Mode", "");
    if (value === "conservative") updated[alphaField] = 1;
  } else if (["diameterMm", "sigmaSd", "asReqAsProv", "alpha1", "alpha2", "alpha3", "alpha5"].includes(field)) {
    updated[field] = numberOrEmpty(value);
  } else {
    updated[field] = value;
  }
  return persistableOverlapCalc(calculateOverlap(updated), {});
}

function findCheckBySample(sampleId) {
  return state.current?.checkpoints.find((check) => check.samples.some((sample) => sample.id === sampleId)) || null;
}

function findSample(sampleId) {
  const check = findCheckBySample(sampleId);
  return check?.samples.find((sample) => sample.id === sampleId) || null;
}

function addSample(checkId, seed = {}) {
  const check = state.current.checkpoints.find((item) => item.id === checkId);
  if (!check) return;
  activateCheck(check, true);
  const followupNew = isFollowupProtocol() && !checkHasFollowupReference(check);
  if (followupNew) markFollowupNewCheck(check);
  const sample = normalizeSample({
    ...seed,
    id: uid("sample"),
    checkItemId: check.id,
    number: nextSampleNumber(check),
    status: followupNew ? (seed.status || "neu hinzugekommen") : seed.status,
    followupStatus: followupNew ? (seed.followupStatus || "neu hinzugekommen") : seed.followupStatus,
    isFollowupNew: followupNew || !!seed.isFollowupNew,
    createdInProtocolId: followupNew ? state.current.id : seed.createdInProtocolId,
    originProtocolId: followupNew ? null : seed.originProtocolId,
    photos: seed.photos ? seed.photos.map((photo) => ({ ...photo })) : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, check.id, nextSampleNumber(check));
  check.samples.push(sample);
  state.openSampleId = sample.id;
  updateCheckStatus(check);
  persist();
  renderChecklist();
}

function nextSampleNumber(check) {
  return check.samples.reduce((max, sample) => Math.max(max, sample.number || 0), 0) + 1;
}

function duplicateSample(sampleId) {
  const check = findCheckBySample(sampleId);
  const sample = findSample(sampleId);
  if (!check || !sample) return;
  addSample(check.id, {
    location: sample.location,
    status: sample.status,
    note: sample.note,
    planId: sample.planId,
    pageNumber: sample.pageNumber,
    pinId: sample.pinId,
    photos: sample.photos || []
  });
}

function deleteSample(sampleId) {
  const check = findCheckBySample(sampleId);
  if (!check) return;
  check.samples = check.samples.filter((sample) => sample.id !== sampleId);
  updateCheckStatus(check);
  persist();
  renderChecklist();
}

function updateCheckStatus(check) {
  if (!check.samples?.length) {
    check.status = "offen / nicht bewertet";
    return check.status;
  }
  if (check.samples.some((sample) => sample.followupStatus || FOLLOWUP_STATUSES.includes(sample.status))) {
    if (check.samples.some((sample) => ["weiterhin offen", "teilweise erledigt", "nicht prüfbar", "neu hinzugekommen"].includes(sample.followupStatus || sample.status))) {
      check.status = "teilweise / Auflage";
    } else if (check.samples.every((sample) => (sample.followupStatus || sample.status) === "erledigt")) {
      check.status = "fertig / OK";
    } else {
      check.status = "offen / nicht bewertet";
    }
    return check.status;
  }
  if (check.samples.some((sample) => sample.status === "nicht OK / Mangel")) {
    check.status = "nicht OK / Mangel";
  } else if (check.samples.some((sample) => sample.status === "teilweise / Auflage")) {
    check.status = "teilweise / Auflage";
  } else if (check.samples.some((sample) => sample.status === "Dokumentation")) {
    check.status = "Dokumentation";
  } else if (check.samples.every((sample) => sample.status === "fertig / OK")) {
    check.status = "fertig / OK";
  } else {
    check.status = "nicht relevant";
  }
  return check.status;
}

function numberOrEmpty(value) {
  const number = Number(value);
  return Number.isFinite(number) && value !== "" && value !== null && value !== undefined ? number : "";
}

function numberOrDefault(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && value !== "" && value !== null && value !== undefined ? number : fallback;
}

function asNumber(value) {
  if (value === "" || value === null || value === undefined) return "";
  const number = Number(String(value).replace(",", "."));
  return Number.isFinite(number) ? number : "";
}

function unitToMm(value, unit) {
  const number = asNumber(value);
  if (number === "") return "";
  return unit === "cm" ? number * 10 : number;
}

function mmToUnitValue(mm, unit) {
  const number = asNumber(mm);
  if (number === "") return "";
  return unit === "cm" ? round(number / 10) : round(number);
}

function formatMmCm(mm) {
  const number = asNumber(mm);
  if (number === "") return "keine Angabe";
  return `${round(number)} mm / ${round(number / 10)} cm`;
}

function formatApproxMmCm(mm) {
  const number = asNumber(mm);
  if (number === "") return "keine Angabe";
  return `ca. ${round(number)} mm / ${round(number / 10)} cm`;
}

function formatDifference(mm) {
  const number = asNumber(mm);
  if (number === "") return "keine Angabe";
  const sign = number > 0 ? "+" : "";
  return `${sign}${round(number)} mm / ${sign}${round(number / 10)} cm`;
}

function round(value, digits = 1) {
  const number = asNumber(value);
  if (number === "") return "";
  return Math.round(number * 10 ** digits) / 10 ** digits;
}

function bondLabel(value) {
  return ({ good: "gute Verbundbedingungen", moderate: "mäßige Verbundbedingungen", unknown: "unbekannte/konservativ mäßige Verbundbedingungen" })[value] || value;
}

function sigmaModeLabel(value) {
  return ({ fyd: "konservativ fyd verwenden", custom: "reduzierte Stahlspannung manuell eingegeben", from_plan: "aus Statik/Plan übernommen" })[value] || value;
}

function spliceRatioLabel(value) {
  return ({ le25: "≤25 %", p33: "33 %", p50: "50 %", gt50: ">50 %", unknown: "unbekannt" })[value] || value;
}

function statusButtons(active, group) {
  return `<div class="status-row">${STATUSES.map((status) => `
    <button class="status-btn ${active === status ? "active" : ""}" data-${group}="${status}" data-status="${status}" type="button">${statusLabel(status)}</button>
  `).join("")}</div>`;
}

function statusLabel(status) {
  if (status === "Dokumentation") return "Doku";
  return status.replace("fertig / ", "").replace("teilweise / ", "").replace("nicht OK / ", "");
}

function thumbs(photos) {
  if (!photos?.length) return "";
  return `<div class="thumb-row">${photos.map((photo) => `<figure class="sample-photo compact"><img class="thumb" data-photo-thumb="${photo.id}" alt="${escapeAttr(photo.name || "Foto")}">${photoBackupActions(photo)}</figure>`).join("")}</div>`;
}

async function handlePlanFiles(files) {
  if (!state.current || !files.length) return;
  saveFromForm();
  for (const file of files) {
    if (!file || !file.size) {
      showPlanImportMessage("Plan konnte nicht gelesen werden. Bitte Datei erneut auswählen.", true);
      continue;
    }
    const meta = derivePlanMeta(file.name, state.current.head.planDate);
    const plan = {
      id: uid("plan"),
      number: state.current.plans.length + 1,
      fileName: file.name,
      title: meta.title,
      appPlanName: meta.appPlanName,
      category: meta.category,
      floor: meta.floor,
      component: meta.component,
      planNumber: meta.planNumber,
      planNo: meta.planNumber,
      planDate: meta.planDate,
      planIndex: "",
      documentStatus: "verwendet",
      source: "uploaded",
      dropboxPath: "",
      dropboxSharedLink: "",
      dropboxFileName: "",
      dropboxFileId: "",
      dropboxRev: "",
      lastSyncedAt: "",
      lastManualSync: "",
      syncStatus: "not_configured",
      autoMetaStatus: "",
      planDateCandidates: [],
      remark: "",
      type: file.type || guessFileType(file.name),
      fileSize: file.size || 0,
      pageCount: (file.type || guessFileType(file.name)) === "application/pdf" ? 0 : 1,
      currentPage: 1,
      zoom: 1,
      renderStatus: "idle",
      renderError: ""
    };
    await idbPut("plans", {
        id: plan.id,
        projectId: state.current.projectId,
        acceptanceId: state.current.id,
        protocolId: state.current.id,
        fileName: file.name,
      fileType: plan.type,
      fileSize: plan.fileSize,
      planName: plan.title,
      appPlanName: plan.appPlanName || plan.title || "",
      category: plan.category || "Sonstiges",
      floor: plan.floor || "",
      component: plan.component || "",
      planNo: plan.planNo || plan.planNumber || "",
      planNumber: plan.planNumber,
      planDate: plan.planDate,
      planIndex: plan.planIndex,
      documentStatus: plan.documentStatus,
      source: plan.source,
      dropboxPath: plan.dropboxPath,
      dropboxSharedLink: plan.dropboxSharedLink,
      dropboxFileName: plan.dropboxFileName,
      dropboxFileId: plan.dropboxFileId,
      dropboxRev: plan.dropboxRev,
      lastSyncedAt: plan.lastSyncedAt,
      lastManualSync: plan.lastManualSync,
      syncStatus: plan.syncStatus,
      autoMetaStatus: plan.autoMetaStatus,
      planDateCandidates: plan.planDateCandidates,
      remark: plan.remark,
      pageCount: plan.pageCount,
      blob: file
    });
    const saved = await idbGet("plans", plan.id);
    if (!saved?.blob || !saved.blob.size) {
      plan.renderStatus = "error";
      plan.renderError = "Plan konnte nicht gelesen werden. Bitte Datei erneut auswählen.";
      showPlanImportMessage(plan.renderError, true);
      continue;
    }
    plan.fileSize = saved.blob.size || plan.fileSize;
    state.current.plans.push(plan);
    state.selectedPlanId = plan.id;
    state.current.activePlanId = plan.id;
    plan.currentPage = 1;
    if (plan.type === "application/pdf") {
      await preloadPdf(plan);
      await extractPdfPlanMetadata(plan);
    }
    showPlanImportMessage("Plan importiert und geladen");
  }
  saveFromForm();
  renderPlanControls();
  await renderPlan();
}


async function importProjectPlanFiles(files, projectId = state.currentProjectId) {
  const project = projectById(projectId);
  if (!project) return showAppToast("Bitte zuerst ein Projekt öffnen.", { type: "error" });
  state.currentProjectId = project.id;
  const protocol = ensureProjectPlanLibraryProtocol(project.id);
  if (!protocol) return showAppToast("Projektplanablage konnte nicht vorbereitet werden.", { type: "error" });
  const fileList = Array.from(files || []);
  if (!fileList.length) return;
  let imported = 0;
  for (const file of fileList) {
    if (!file || !file.size) {
      showAppToast("Plan konnte nicht gelesen werden. Bitte Datei erneut auswählen.", { type: "error" });
      continue;
    }
    const meta = derivePlanMeta(file.name, project.planDate || "");
    const type = file.type || guessFileType(file.name);
    const plan = normalizePlanMeta({
      id: uid("plan"),
      number: protocol.plans.length + 1,
      fileName: file.name,
      title: meta.title,
      appPlanName: meta.appPlanName,
      category: meta.category,
      floor: meta.floor,
      component: meta.component,
      planNumber: meta.planNumber,
      planNo: meta.planNumber,
      planDate: meta.planDate,
      planIndex: "",
      documentStatus: "verwendet",
      source: "uploaded",
      dropboxPath: "",
      dropboxSharedLink: "",
      dropboxFileName: "",
      dropboxFileId: "",
      dropboxRev: "",
      lastSyncedAt: "",
      lastManualSync: "",
      syncStatus: "not_configured",
      autoMetaStatus: "",
      planDateCandidates: [],
      remark: "",
      type,
      fileSize: file.size || 0,
      pageCount: type === "application/pdf" ? 0 : 1,
      currentPage: 1,
      zoom: 1,
      renderStatus: "idle",
      renderError: ""
    });
    await idbPut("plans", {
      id: plan.id,
      projectId: project.id,
      acceptanceId: protocol.id,
      protocolId: protocol.id,
      fileName: file.name,
      fileType: plan.type,
      fileSize: plan.fileSize,
      planName: plan.title,
      appPlanName: plan.appPlanName || plan.title || "",
      category: plan.category || "Sonstiges",
      floor: plan.floor || "",
      component: plan.component || "",
      planNo: plan.planNo || plan.planNumber || "",
      planNumber: plan.planNumber,
      planDate: plan.planDate,
      planIndex: plan.planIndex,
      documentStatus: plan.documentStatus,
      source: plan.source,
      dropboxPath: plan.dropboxPath,
      dropboxSharedLink: plan.dropboxSharedLink,
      dropboxFileName: plan.dropboxFileName,
      dropboxFileId: plan.dropboxFileId,
      dropboxRev: plan.dropboxRev,
      lastSyncedAt: plan.lastSyncedAt,
      lastManualSync: plan.lastManualSync,
      syncStatus: plan.syncStatus,
      autoMetaStatus: plan.autoMetaStatus,
      planDateCandidates: plan.planDateCandidates,
      remark: plan.remark,
      pageCount: plan.pageCount,
      blob: file
    });
    const saved = await idbGet("plans", plan.id);
    if (!saved?.blob || !saved.blob.size) {
      showAppToast("Plan konnte nicht gelesen werden. Bitte Datei erneut auswählen.", { type: "error" });
      continue;
    }
    plan.fileSize = saved.blob.size || plan.fileSize;
    protocol.plans.push(plan);
    if (plan.type === "application/pdf") {
      await preloadPdf(plan);
      await extractPdfPlanMetadata(plan);
    }
    imported += 1;
  }
  protocol.updatedAt = new Date().toISOString();
  const projectRecord = projectById(project.id);
  if (projectRecord) projectRecord.updatedAt = protocol.updatedAt;
  await persist();
  showView("projectPlansView");
  renderProjectPlansView();
  renderDatalists();
  showAppToast(imported === 1 ? "Plan hochgeladen und im Projekt gespeichert." : `${imported} Pläne hochgeladen und im Projekt gespeichert.`, { type: imported ? "success" : "info" });
}

function deleteProjectPlan(protocolId, planId) {
  const entry = findProjectPlanEntry(protocolId, planId);
  if (!entry) return showAppToast("Plan nicht gefunden.", { type: "error" });
  const referencedPins = state.protocols.reduce((sum, protocol) => sum + (protocol.pins || []).filter((pin) => pinPlacements(pin).some((placement) => placement.planId === planId) || pin.planId === planId).length, 0);
  const warning = referencedPins ? `\n\nAchtung: ${referencedPins} Pin-/Planbezug(e) verweisen auf diesen Plan.` : "";
  if (!confirm(`Plan wirklich löschen? Die gespeicherte Plan-Datei wird aus der lokalen Projektablage entfernt.${warning}`)) return;
  entry.protocol.plans = (entry.protocol.plans || []).filter((plan) => plan.id !== planId);
  entry.protocol.updatedAt = new Date().toISOString();
  idbDelete("plans", planId);
  if (state.current?.activePlanId === planId) state.current.activePlanId = state.current.plans?.[0]?.id || "";
  if (state.selectedPlanId === planId) state.selectedPlanId = state.current?.activePlanId || "";
  persist();
  renderProjectPlansView();
  if (state.current?.id === entry.protocol.id) {
    renderPlanControls();
    renderPlan();
  }
  showAppToast("Plan gelöscht.", { type: "success" });
}

async function extractPdfPlanMetadata(plan) {
  try {
    const doc = await getPdfDocument(plan);
    const pageLimit = Math.min(doc.numPages || 1, 2);
    const pageTexts = [];
    for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
      const page = await doc.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items.map((item) => item.str || "").filter(Boolean).join(" ");
      if (text.trim()) pageTexts.push(text);
    }
    const text = pageTexts.join("\n");
    if (!text.trim()) {
      plan.autoMetaStatus = "Planstand konnte nicht automatisch ausgelesen werden. Bitte manuell eintragen.";
      plan.planDateCandidates = [];
      await syncPlanRecord(plan);
      return;
    }
    const extracted = parsePlanMetadataText(text);
    if (extracted.planNumber && !plan.planNumber) plan.planNumber = extracted.planNumber;
    if (extracted.planDate) plan.planDate = extracted.planDate;
    if (extracted.planIndex) plan.planIndex = extracted.planIndex;
    plan.planDateCandidates = extracted.dateCandidates;
    plan.autoMetaStatus = extracted.found
      ? "Automatisch erkannt – bitte prüfen."
      : "Planstand konnte nicht automatisch ausgelesen werden. Bitte manuell eintragen.";
    await syncPlanRecord(plan);
  } catch (error) {
    plan.autoMetaStatus = `Planstand konnte nicht automatisch ausgelesen werden. Bitte manuell eintragen. (${error.message || error})`;
    await syncPlanRecord(plan);
  }
}

function parsePlanMetadataText(text) {
  const compact = text.replace(/\s+/g, " ").trim();
  const dateMatches = extractPlanDateCandidates(compact);
  const indexMatch = compact.match(/\b(?:Index|Revision|Rev\.?|Änderung)\s*[:\-]?\s*([A-Za-zÄÖÜäöü]|\d{1,3})\b/i);
  const planNumberMatch = compact.match(/\b(?:Plan[-\s]?Nr\.?|Plan\s*Nr\.?|Plannummer)\s*[:\-]?\s*([A-ZÄÖÜ]{1,3}[-\s]\d{2,4}[A-Z]?)\b/i)
    || compact.match(/\b([A-ZÄÖÜ]{1,4}[-\s]?\d{2,4}[A-Z]?)\b/i);
  return {
    planNumber: planNumberMatch ? safePlanNumberCandidate(planNumberMatch[1]) : "",
    planDate: dateMatches[0]?.value || "",
    planIndex: indexMatch ? indexMatch[1] : "",
    dateCandidates: dateMatches.map((item) => item.value),
    found: !!(dateMatches[0]?.value || indexMatch || planNumberMatch)
  };
}

function extractPlanDateCandidates(text) {
  const dateRegex = /\b(\d{1,2}[.\/]\d{1,2}[.\/]\d{4}|\d{4}-\d{1,2}-\d{1,2})\b/g;
  const candidates = [];
  let match;
  while ((match = dateRegex.exec(text))) {
    const value = normalizePlanDate(match[1]);
    const start = Math.max(0, match.index - 90);
    const end = Math.min(text.length, match.index + match[1].length + 45);
    const context = text.slice(start, end).toLowerCase();
    let score = 0;
    if (/planstand|plandatum|stand|ausgabe/.test(context)) score += 6;
    if (/datum/.test(context)) score += 4;
    if (/index|änderung|revision|rev\./.test(context)) score += 3;
    if (/freigegeben|geprüft|gezeichnet|gez\./.test(context)) score += 1;
    candidates.push({ value, score, index: match.index });
  }
  const unique = [];
  for (const candidate of candidates) {
    if (!unique.some((item) => item.value === candidate.value)) unique.push(candidate);
  }
  return unique.sort((a, b) => b.score - a.score || a.index - b.index);
}

function normalizePlanDate(value) {
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
  }
  const parts = value.split(/[.\/]/);
  if (parts.length === 3) return `${parts[0].padStart(2, "0")}.${parts[1].padStart(2, "0")}.${parts[2]}`;
  return value;
}

function showPlanImportMessage(message, isError = false) {
  const target = $("#planStatus");
  if (!target) return;
  target.textContent = message;
  target.classList.toggle("field-warning", !!isError);
}

function safePlanNumberCandidate(value) {
  const candidate = String(value || "").replace(/\s+/g, "-").toUpperCase();
  if (!candidate) return "";
  const prefix = candidate.split("-")[0];
  if (["DIN", "EN", "ISO", "EC", "EC2"].includes(prefix)) return "";
  return /^[A-ZÄÖÜ]{1,3}-\d{2,4}[A-Z]?$/.test(candidate) ? candidate : "";
}
function derivePlanMeta(fileName, defaultPlanDate = "") {
  const base = fileName.replace(/\.[^.]+$/, "");
  const normalized = base.replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
  const planNumberMatch = normalized.match(/\b[A-ZÄÖÜ]{1,3}[-\s]\d{2,4}[A-Z]?\b/i);
  const planNumber = planNumberMatch ? safePlanNumberCandidate(planNumberMatch[0]) : "";
  let title = normalized;
  if (planNumber) title = title.replace(planNumberMatch[0], "");
  title = title
    .replace(/[-–—]+/g, " ")
    .replace(/\b(plan|bewehrungsplan|schalplan)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const draft = { fileName, title: title || normalized || fileName, planNumber };
  const category = inferPlanCategory(draft);
  const floor = inferPlanFloor(draft);
  const component = inferPlanComponent(draft);
  return {
    planNumber,
    title: draft.title,
    appPlanName: draft.title,
    category,
    floor,
    component,
    planDate: defaultPlanDate || ""
  };
}

function guessFileType(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

function sanitizePhotoBackupFileName(value = "") {
  return String(value || "Foto")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120) || "Foto";
}

function photoBackupFileName(photo = {}) {
  const project = projectById(state.current?.projectId || state.currentProjectId || "");
  const parts = [project?.name || state.current?.head?.projectName || "Projekt", state.current?.head?.acceptanceTitle || state.current?.head?.component || state.current?.kind || "Abnahme"];
  const refs = findCurrentPhotoRefs(photo.id || "");
  const pinRef = refs.find((ref) => ref.kind === "pin");
  const sampleRef = refs.find((ref) => ref.kind === "sample");
  const siteRef = refs.find((ref) => ref.kind === "siteItem");
  if (pinRef?.pin) parts.push(pinLabel(pinRef.pin), pinRef.pin.title || "Pin");
  else if (sampleRef?.sample) parts.push(`Pruefstelle_${sampleRef.sample.number || ""}`, sampleRef.sample.location || "");
  else if (siteRef?.item) parts.push(siteRef.item.type || "Feststellung", siteRef.item.location || "");
  else parts.push(photo.name || "Foto");
  const stamp = (photo.createdAt || new Date().toISOString()).replace(/[-:]/g, "").replace("T", "_").slice(0, 13);
  const ext = (photo.type || photo.fileType || "image/jpeg").includes("png") ? "png" : "jpg";
  return `${sanitizePhotoBackupFileName(parts.filter(Boolean).join("_"))}_${stamp}.${ext}`;
}

function findCurrentPhotoRefs(photoId = "") {
  if (!state.current || !photoId) return [];
  const refs = [];
  (state.current.overviewPhotos || []).forEach((item) => { if (item.photoId === photoId) refs.push({ kind: "overview", item }); });
  (state.current.pins || []).forEach((pin) => (pin.photos || []).forEach((photo) => { if (photo.id === photoId) refs.push({ kind: "pin", pin, photo }); }));
  (state.current.checkpoints || []).forEach((check) => {
    (check.photos || []).forEach((photo) => { if (photo.id === photoId) refs.push({ kind: "check", check, photo }); });
    (check.samples || []).forEach((sample) => (sample.photos || []).forEach((photo) => { if (photo.id === photoId) refs.push({ kind: "sample", check, sample, photo }); }));
  });
  (state.current.siteItems || []).forEach((item) => (item.photos || []).forEach((photo) => { if (photo.id === photoId) refs.push({ kind: "siteItem", item, photo }); }));
  (state.current.dailyReport?.photos || []).forEach((photo) => { if (photo.id === photoId) refs.push({ kind: "dailyReport", photo }); });
  return refs;
}

function updatePhotoBackupRefs(photoId, fields = {}) {
  findCurrentPhotoRefs(photoId).forEach((ref) => {
    if (ref.photo) Object.assign(ref.photo, fields);
    if (ref.kind === "overview" && ref.item) Object.assign(ref.item, fields, { updatedAt: new Date().toISOString() });
  });
}

async function updateStoredPhotoBackup(photoId, fields = {}) {
  const record = await idbGet("photos", photoId);
  if (record) await idbPut("photos", { ...record, ...fields });
  updatePhotoBackupRefs(photoId, fields);
  await persist();
}

function photoBackupActions(photo = {}) {
  const status = photoBackupStatus(photo);
  return `<div class="photo-backup-box ${status === "user_confirmed_external" ? "done" : "open"}">
    <div><strong>Foto in App gespeichert</strong><br><span>${status === "user_confirmed_external" ? "Extern gesichert" : "Externe Sicherung noch offen"}</span></div>
    ${photoBackupBadge(photo)}
    <div class="photo-backup-actions">
      <button class="small-btn" type="button" data-photo-backup-share="${escapeAttr(photo.id)}">Foto extern sichern</button>
      <button class="small-btn" type="button" data-photo-backup-download="${escapeAttr(photo.id)}">Download</button>
      ${status !== "user_confirmed_external" ? `<button class="small-btn" type="button" data-photo-backup-confirm="${escapeAttr(photo.id)}">Ich habe das Foto extern gesichert</button>` : ""}
    </div>
  </div>`;
}

function photoBackupSummaryHtml() {
  const photos = collectCurrentPhotoRefs();
  if (!photos.length) return `<section class="photo-backup-summary"><h3>Fotos dieser Abnahme</h3><p class="muted">Noch keine Fotos vorhanden.</p></section>`;
  const unique = new Map();
  photos.forEach((photo) => { if (photo?.id && !unique.has(photo.id)) unique.set(photo.id, photo); });
  const list = [...unique.values()];
  const secured = list.filter((photo) => photoBackupStatus(photo) === "user_confirmed_external").length;
  const open = list.length - secured;
  return `<section class="photo-backup-summary"><h3>Fotos dieser Abnahme</h3><p>${list.length} Foto(s) gesamt · ${open} externe Sicherung offen · ${secured} extern gesichert</p>${open ? `<p class="report-warning">Web-Apps speichern Kamerafotos nicht immer automatisch in der Galerie. Bitte offene Fotos zusätzlich sichern.</p>` : `<p class="muted">Alle bekannten Fotos sind als extern gesichert markiert.</p>`}</section>`;
}

function collectCurrentPhotoRefs() {
  if (!state.current) return [];
  const photos = [];
  (state.current.overviewPhotos || []).forEach((item) => photos.push({ id: item.photoId, name: item.caption || "Übersichtsfoto", type: "image/jpeg", external_backup_status: item.external_backup_status || "unknown", external_backup_method: item.external_backup_method || "", original_capture_source: item.original_capture_source || "" }));
  (state.current.pins || []).forEach((pin) => photos.push(...(pin.photos || [])));
  (state.current.checkpoints || []).forEach((check) => {
    photos.push(...(check.photos || []));
    (check.samples || []).forEach((sample) => photos.push(...(sample.photos || [])));
  });
  (state.current.siteItems || []).forEach((item) => photos.push(...(item.photos || [])));
  photos.push(...(state.current.dailyReport?.photos || []));
  return photos.filter((photo) => photo?.id);
}

function hasUnsecuredCurrentPhotos() {
  const seen = new Set();
  return collectCurrentPhotoRefs().some((photo) => {
    if (!photo?.id || seen.has(photo.id)) return false;
    seen.add(photo.id);
    return photoBackupStatus(photo) !== "user_confirmed_external";
  });
}

async function shareOrDownloadPhoto(photoId, mode = "share") {
  const refs = findCurrentPhotoRefs(photoId);
  const storedPhoto = refs.find((ref) => ref.photo)?.photo;
  const overviewItem = refs.find((ref) => ref.item)?.item;
  const photo = storedPhoto || (overviewItem ? { ...overviewItem, id: photoId, name: overviewItem.caption || overviewItem.name || "Übersichtsfoto", type: overviewItem.type || "image/jpeg" } : { id: photoId, name: "Foto", type: "image/jpeg" });
  const record = await idbGet("photos", photoId);
  if (!record?.blob) return showAppToast("Foto konnte nicht geladen werden.", { type: "error" });
  const type = record.fileType || photo.type || "image/jpeg";
  const fileName = photoBackupFileName({ ...photo, type, createdAt: record.createdAt || photo.createdAt });
  const file = typeof File === "function" ? new File([record.blob], fileName, { type }) : null;
  const markStarted = async (status, method) => {
    await updateStoredPhotoBackup(photoId, { external_backup_status: status, external_backup_at: new Date().toISOString(), external_backup_method: method });
    renderAfterPhotoBackupChange();
  };
  if (mode === "share" && navigator.share && file) {
    try {
      await navigator.share({ title: "Foto sichern", text: "Baustellenfoto zusätzlich sichern/teilen.", files: [file] });
      await markStarted("share_started", "share");
      showAppToast("Share-Dialog geöffnet. Bitte anschließend bestätigen, wenn das Foto extern gesichert ist.", { type: "success" });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
      console.warn("Foto-Teilen nicht möglich", error);
    }
  }
  const url = URL.createObjectURL(record.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  await markStarted("download_started", "download");
  showAppToast("Download gestartet. Bitte anschließend bestätigen, wenn das Foto extern gesichert ist.", { type: "success" });
}

async function confirmPhotoExternalBackup(photoId) {
  await updateStoredPhotoBackup(photoId, { external_backup_status: "user_confirmed_external", external_backup_at: new Date().toISOString(), external_backup_method: "manual_confirm" });
  renderAfterPhotoBackupChange();
  showAppToast("Foto als extern gesichert markiert.", { type: "success" });
}

function renderAfterPhotoBackupChange() {
  if ($("#selectedPinPanel")) renderPinEditor();
  if ($("#checkList")) renderChecklist();
  renderOverviewPhotos();
  if ($("#photoGrid")) renderPhotoDialog();
  if ($("#markPinSheet")) renderMarkPinSheet(state.selectedPinId);
  if (isSiteControlProtocol()) renderSiteControlEditor();
  if (isDailyReportProtocol()) renderDailyReportEditor();
}

function confirmReportWithUnsecuredPhotos() {
  if (!hasUnsecuredCurrentPhotos()) return true;
  return confirm("Es gibt Fotos, die noch nicht extern gesichert wurden. Bericht trotzdem erzeugen?");
}

async function savePdfFromA4ReportWithPhotoWarning() {
  if (!confirmReportWithUnsecuredPhotos()) return false;
  await savePdfFromA4Report();
  return true;
}

async function openReportDialogWithPhotoWarning(options = {}) {
  if (!confirmReportWithUnsecuredPhotos()) return false;
  await openReportDialog(options);
  return true;
}

async function addPhotos(files, explicitTarget = null) {
  const target = explicitTarget || state.photoTarget;
  if (!target || !files.length || !state.current) return;
  const photos = [];
  const overviewEntries = [];
  const projectId = state.current.projectId || state.currentProjectId || "";
  const protocolId = state.current.id || "";
  const source = target.source || "file";
  const initialBackupStatus = source === "gallery" ? "user_confirmed_external" : "app_only";
  const initialBackupMethod = source === "gallery" ? "gallery_input" : "";
  for (const file of files) {
    if (!file || !file.size) continue;
    const photo = normalizePhotoRef({ id: uid("photo"), name: file.name || "Foto", type: file.type || "image/jpeg", createdAt: new Date().toISOString(), barCountAnalysis: null, external_backup_status: initialBackupStatus, external_backup_at: source === "gallery" ? new Date().toISOString() : "", external_backup_method: initialBackupMethod, original_capture_source: source });
    const sample = target.kind === "sample" ? findSample(target.id) : null;
    const check = target.kind === "check" ? state.current.checkpoints.find((item) => item.id === target.id) : (sample ? findCheckBySample(sample.id) : null);
    await idbPut("photos", {
      id: photo.id,
      projectId,
      acceptanceId: protocolId,
      protocolId,
      pinId: target.kind === "pin" ? target.id : (sample?.pinId || ""),
      checkItemId: check?.id || "",
      sampleId: sample?.id || "",
      fileName: file.name || "Foto",
      fileType: photo.type,
      blob: file,
      note: "",
      barCountAnalysis: null,
      external_backup_status: photo.external_backup_status,
      external_backup_at: photo.external_backup_at,
      external_backup_method: photo.external_backup_method,
      original_capture_source: photo.original_capture_source,
      createdAt: photo.createdAt
    });
    photos.push(photo);
    if (target.kind === "overview") {
      overviewEntries.push({
        id: uid("overview"),
        protocolId,
        photoId: photo.id,
        caption: "",
        order: (state.current.overviewPhotos || []).length + overviewEntries.length + 1,
        isCover: !(state.current.overviewPhotos || []).some((item) => item.isCover) && overviewEntries.length === 0,
        createdAt: photo.createdAt,
        updatedAt: photo.createdAt,
        external_backup_status: photo.external_backup_status,
        external_backup_at: photo.external_backup_at,
        external_backup_method: photo.external_backup_method,
        original_capture_source: photo.original_capture_source
      });
    }
  }
  if (!photos.length) {
    showAppToast("Foto konnte nicht gelesen werden.", { type: "error" });
    return;
  }
  if (target.kind === "overview") {
    state.current.overviewPhotos = normalizeOverviewPhotos([...(state.current.overviewPhotos || []), ...overviewEntries], state.current.id);
  }
  if (target.kind === "pin") {
    const pin = state.current.pins.find((item) => item.id === target.id);
    if (pin) {
      pin.photos = pin.photos || [];
      pin.photos.push(...photos);
      const siteItem = pin.itemId ? findSiteControlItem(pin.itemId) : null;
      if (siteItem) syncSiteControlItemPinReference(siteItem, pin);
    }
  }
  if (target.kind === "check") {
    const check = state.current.checkpoints.find((item) => item.id === target.id);
    if (check) {
      activateCheck(check);
      check.photos = check.photos || [];
      check.photos.push(...photos);
    }
  }
  if (target.kind === "sample") {
    const sample = findSample(target.id);
    const check = findCheckBySample(target.id);
    if (sample) {
      activateCheck(check);
      sample.photos = sample.photos || [];
      sample.photos.push(...photos);
      if (sample.pinId) {
        const pin = state.current.pins.find((item) => item.id === sample.pinId);
        if (pin) {
          pin.photos = pin.photos || [];
          photos.forEach((photo) => {
            if (!pin.photos.some((item) => item.id === photo.id)) pin.photos.push(photo);
          });
        }
      }
      sample.updatedAt = new Date().toISOString();
      if (check) updateCheckStatus(check);
    }
  }
  if (target.kind === "siteItem") {
    const item = findSiteControlItem(target.id);
    if (item) {
      item.photos = item.photos || [];
      item.photos.push(...photos);
      item.updatedAt = new Date().toISOString();
      await persist();
      renderSiteControlEditor();
      showAppToast("Foto gespeichert und zugeordnet.", { type: "success" });
      return;
    }
  }
  if (target.kind === "dailyReport") {
    state.current.dailyReport = normalizeDailyReportMeta(state.current.dailyReport || {}, state.current);
    state.current.dailyReport.photos = state.current.dailyReport.photos || [];
    state.current.dailyReport.photos.push(...photos.map((photo) => ({ ...photo, caption: "" })));
    state.current.updatedAt = new Date().toISOString();
    await persist();
    renderDailyReportEditor();
    showAppToast("Foto gespeichert und zugeordnet.", { type: "success" });
    return;
  }
  saveFromForm(false);
  await persist();
  renderPinEditor();
  renderChecklist();
  renderOverviewPhotos();
  renderPhotoDialog();
  renderMarkPinSheet(state.selectedPinId);
  showAppToast("Foto gespeichert und zugeordnet. Fotos werden in der App gespeichert, nicht automatisch in der Handy-Galerie.", { type: "success" });
}

function triggerPhotoPicker(kind, id, source) {
  state.photoTarget = { kind, id, source };
  renderPhotoDialog();
  const input = source === "gallery" ? $("#photoGalleryInput") : $("#photoCameraInput");
  if (!input) return;
  input.value = "";
  input.click();
}

function triggerOverviewPhotoPicker(source) {
  if (!state.current) {
    alert("Bitte zuerst eine Abnahme öffnen.");
    return;
  }
  state.photoTarget = { kind: "overview", id: state.current.id, source };
  const input = source === "gallery" ? $("#overviewGalleryInput") : $("#overviewCameraInput");
  if (!input) {
    alert("Foto konnte nicht geöffnet oder gespeichert werden.");
    return;
  }
  input.value = "";
  input.click();
}

function triggerInlinePhotoPicker(kind, id, source) {
  const target = { kind, id, source };
  state.photoTarget = target;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  if (source === "camera") input.setAttribute("capture", "environment");
  if (source === "gallery") input.multiple = true;
  input.className = "visually-hidden";
  input.addEventListener("change", async () => {
    await addPhotos(Array.from(input.files || []), target);
    input.remove();
  }, { once: true });
  document.body.appendChild(input);
  input.click();
}

function openPhotoDialog(kind, id) {
  state.photoTarget = { kind, id };
  renderPhotoDialog();
  $("#photoDialog").showModal();
}

function renderPhotoDialog() {
  const target = state.photoTarget;
  let title = "";
  let photos = [];
  if (target?.kind === "pin") {
    const pin = state.current.pins.find((item) => item.id === target.id);
    title = `${pinLabel(pin)} ${pin.title || ""}`;
    photos = pin.photos;
  }
  if (target?.kind === "check") {
    const check = state.current.checkpoints.find((item) => item.id === target.id);
    title = check.title;
    photos = check.photos;
  }
  if (target?.kind === "sample") {
    const sample = findSample(target.id);
    const check = findCheckBySample(target.id);
    title = `${check?.title || "Prüfstelle"} – Prüfstelle ${sample?.number || ""}`;
    photos = sample?.photos || [];
  }
  $("#photoDialogTitle").textContent = title;
  $("#photoGrid").innerHTML = photos.map((photo) => `
    <figure class="photo-tool-card">
      <img data-photo-thumb="${photo.id}" alt="${escapeAttr(photo.name || "Foto")}">
      <figcaption>
        <span>${escapeHtml(photo.name || "Foto")}</span>
        ${barCountSummary(photo)}
        ${photoBackupActions(photo)}
        <button class="small-btn" type="button" data-bar-count-photo="${photo.id}">Stäbe zählen (Beta)</button>
      </figcaption>
    </figure>
  `).join("");
  const cameraInput = $("#photoCameraInput");
  const galleryInput = $("#photoGalleryInput");
  if (cameraInput) cameraInput.value = "";
  if (galleryInput) galleryInput.value = "";
  hydratePhotoThumbs($("#photoGrid"));
}

function openPlanMarkDialog(sampleId) {
  const sample = findSample(sampleId);
  if (!sample) return;
  const plans = markPlansForCurrentContext();
  if (!plans.length) {
    alert("Keine Projektpläne vorhanden. Bitte in der Projektzentrale unter Projektpläne zuerst einen Plan hochladen.");
    return;
  }
  if (isAndroidFirefox()) {
    alert(androidFirefoxWarningText());
  }
  const pin = sample.pinId ? state.current.pins.find((item) => item.id === sample.pinId) : null;
  if (pin) state.selectedPinId = pin.id;
  const preferredPlanId = pin?.planId || sample.planId || state.selectedPlanId || state.current.activePlanId || plans[0].id;
  const selectedMarkPlan = planById(preferredPlanId) || plans[0];
  if (!selectedMarkPlan) {
    alert("Keine Projektpläne vorhanden. Bitte in der Projektzentrale unter Projektpläne zuerst einen Plan hochladen.");
    return;
  }
  state.markTarget = { kind: "rebar", sampleId };
  state.mark = {
    ...state.mark,
    sampleId,
    planId: selectedMarkPlan.id,
    pageNumber: Math.max(1, Math.min(pin?.pageNumber || sample.pageNumber || 1, selectedMarkPlan.pageCount || 1)),
    zoom: 1,
    panX: 0,
    panY: 0,
    active: false,
    movePinId: "",
    isPinching: false,
    pinchStartDistance: 0,
    pinchStartZoom: 1,
    pinchCenter: null,
    pointers: new Map(),
    moved: false
  };
  renderMarkSelectors();
  $("#planMarkDialog").showModal();
  renderMarkPlan();
  if (pin) requestAnimationFrame(() => { state.selectedPinId = pin.id; renderMarkPins(); renderMarkPinSheet(pin.id); });
}

function openSiteControlPlanMarkDialog(itemId, { reset = false } = {}) {
  const item = findSiteControlItem(itemId);
  if (!item) return;
  const plans = markPlansForCurrentContext();
  if (!plans.length) {
    alert("Keine Projektpl\u00e4ne vorhanden. Bitte in der Projektzentrale oder in einer Bewehrungsabnahme zuerst einen Plan hinzuf\u00fcgen.");
    return;
  }
  if (isAndroidFirefox()) alert(androidFirefoxWarningText());
  const pin = item.pinId ? state.current.pins.find((entry) => entry.id === item.pinId) : null;
  const preferredPlanId = pin?.planId || item.planId || state.mark.planId || plans[0].id;
  const selectedMarkPlan = planById(preferredPlanId) || plans[0];
  state.markTarget = { kind: "site-control", itemId: item.id };
  state.mark = {
    ...state.mark,
    sampleId: "",
    siteItemId: item.id,
    planId: selectedMarkPlan.id,
    pageNumber: Math.max(1, Math.min(pin?.pageNumber || item.pageNumber || 1, selectedMarkPlan.pageCount || 1)),
    zoom: 1,
    panX: 0,
    panY: 0,
    active: reset || !pin,
    movePinId: "",
    isPinching: false,
    pinchStartDistance: 0,
    pinchStartZoom: 1,
    pinchCenter: null,
    pointers: new Map(),
    moved: false
  };
  state.selectedPinId = pin?.id || "";
  renderMarkSelectors();
  $("#planMarkDialog").showModal();
  renderMarkPlan();
  if (pin && !reset) renderMarkPinSheet(pin.id);
}

function closePlanMarkDialog() {
  state.mark.active = false;
  state.mark.movePinId = "";
  state.mark.isPinching = false;
  state.mark.pointers.clear();
  state.markTarget = null;
  renderMarkPinSheet("");
  $("#planMarkDialog").close();
}

function renderMarkSelectors() {
  const plans = markPlansForCurrentContext();
  const plan = planById(state.mark.planId) || plans[0];
  state.mark.planId = plan?.id || "";
  const planSelect = $("#markPlanSelect");
  planSelect.innerHTML = plans.length
    ? plans.map((item) => `<option value="${item.id}">${escapeHtml(planDisplayName(item))}</option>`).join("")
    : `<option value="">Keine Planunterlagen vorhanden</option>`;
  planSelect.value = state.mark.planId;
  const pageCount = Math.max(1, plan?.pageCount || 1);
  state.mark.pageNumber = Math.min(Math.max(1, Number(state.mark.pageNumber) || 1), pageCount);
  $("#markPageSelect").innerHTML = Array.from({ length: pageCount }, (_, index) => `<option value="${index + 1}">Seite ${index + 1}</option>`).join("");
  $("#markPageSelect").value = state.mark.pageNumber;
  $("#markPlanTitle").textContent = plan ? `${planDisplayName(plan)} · Seite ${state.mark.pageNumber}` : "Plan markieren";
  $("#markZoomLabel").textContent = `${Math.round((state.mark.zoom || 1) * 100)} %`;
  const movePin = state.current?.pins?.find((pin) => pin.id === state.mark.movePinId);
  const resetPin = state.mark.active && state.selectedPinId ? state.current?.pins?.find((pin) => pin.id === state.selectedPinId) : null;
  $("#markHint").innerHTML = movePin
    ? `Neue Position für ${escapeHtml(pinLabel(movePin))} antippen. <button class="small-btn" type="button" data-cancel-mark-pin-move>Abbrechen</button>`
    : resetPin
      ? `Neue Position für ${escapeHtml(pinLabel(resetPin))} antippen. <button class="small-btn" type="button" data-cancel-mark-pin-move>Abbrechen</button>`
    : state.mark.active
      ? "Pin-Modus aktiv – auf die Planstelle tippen."
      : "Plan auswählen, dann „Pin setzen / Punkt bestätigen“ antippen.";
}

async function renderMarkPlan() {
  const token = ++state.mark.renderToken;
  const plan = planById(state.mark.planId);
  const image = $("#markImage");
  const canvas = $("#markCanvas");
  const empty = $("#markEmpty");
  const layer = $("#markPinLayer");
  const stage = $("#markStage");
  image.onload = null;
  image.onerror = null;
  image.style.display = "none";
  image.style.visibility = "hidden";
  image.classList.remove("rendered-pdf-image");
  canvas.style.display = "none";
  canvas.style.visibility = "hidden";
  image.removeAttribute("src");
  canvas.width = 0;
  canvas.height = 0;
  layer.innerHTML = "";
  stage.style.width = "1px";
  stage.style.height = "1px";
  stage.style.minWidth = "1px";
  stage.style.minHeight = "1px";
  stage.style.transform = "none";
  state.mark.naturalWidth = 0;
  state.mark.naturalHeight = 0;
  state.mark.fitScale = 1;
  if (!plan) {
    empty.style.display = "grid";
    empty.textContent = "Kein Plan gewählt.";
    return;
  }
  empty.style.display = "grid";
  empty.textContent = "Plan wird geladen ...";
  try {
    if (plan.type === "application/pdf") {
      if (!window.pdfjsLib) throw new Error("pdf.js nicht geladen");
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      const doc = await getPdfDocument(plan);
      plan.pageCount = doc.numPages;
      state.mark.pageNumber = Math.min(Math.max(1, state.mark.pageNumber || 1), doc.numPages);
      renderMarkSelectors();
      const page = await doc.getPage(state.mark.pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      if (token !== state.mark.renderToken) return;
      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));
      const ctx = canvas.getContext("2d", { alpha: false });
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;
      if (token !== state.mark.renderToken) return;
      const dataUrl = canvas.toDataURL("image/png");
      image.classList.add("rendered-pdf-image");
      image.onload = () => {
        if (token !== state.mark.renderToken) return;
        prepareMarkPlanSurface(image, canvas.width, canvas.height);
        canvas.style.display = "none";
        canvas.style.visibility = "hidden";
        image.style.display = "block";
        image.style.visibility = "visible";
        empty.style.display = "none";
        renderMarkPins();
      };
      image.onerror = () => {
        if (token !== state.mark.renderToken) return;
        empty.style.display = "grid";
        empty.textContent = "Planbild konnte nicht angezeigt werden.";
      };
      image.src = dataUrl;
      if (image.complete) image.onload();
    } else {
      const imageUrl = await getPlanObjectUrl(plan);
      image.onload = () => {
        if (token !== state.mark.renderToken) return;
        prepareMarkPlanSurface(image, image.naturalWidth || 900, image.naturalHeight || 700);
        canvas.style.display = "none";
        canvas.style.visibility = "hidden";
        image.style.display = "block";
        image.style.visibility = "visible";
        empty.style.display = "none";
        renderMarkPins();
      };
      image.onerror = () => {
        if (token !== state.mark.renderToken) return;
        empty.style.display = "grid";
        empty.textContent = "Bildplan konnte nicht angezeigt werden.";
      };
      image.src = imageUrl;
      if (image.complete && image.naturalWidth) image.onload();
    }
  } catch (error) {
    if (token !== state.mark.renderToken) return;
    empty.style.display = "grid";
    empty.innerHTML = `<div><strong>Plan konnte nicht angezeigt werden.</strong><pre>${escapeHtml(error.message || String(error))}</pre></div>`;
  }
}

function prepareMarkPlanSurface(element, naturalWidth, naturalHeight) {
  state.mark.naturalWidth = Math.max(1, Math.round(naturalWidth || 900));
  state.mark.naturalHeight = Math.max(1, Math.round(naturalHeight || element.naturalHeight || 700));
  state.mark.zoom = state.mark.zoom || 1;
  element.style.width = "100%";
  element.style.height = "100%";
  element.style.transform = "none";
  $("#markPinLayer").style.transform = "none";
  applyMarkStageSize();
  requestAnimationFrame(() => {
    fitMarkPlan();
    renderMarkPins();
  });
}

function applyMarkElementSize() {
  requestAnimationFrame(() => {
    clampMarkPan();
    applyMarkTransform();
  });
}

function visibleMarkElement() {
  const image = $("#markImage");
  if (image && image.style.display !== "none") return image;
  const canvas = $("#markCanvas");
  return canvas && canvas.style.display !== "none" ? canvas : image;
}

function markStageSize(zoom = state.mark.zoom || 1) {
  return {
    width: Math.max(1, Math.round((state.mark.naturalWidth || 1) * zoom)),
    height: Math.max(1, Math.round((state.mark.naturalHeight || 1) * zoom))
  };
}

function normalizeOverviewPhotos(items = [], protocolId = state.current?.id || "") {
  return (items || [])
    .map((item, index) => normalizeOverviewPhotoRef(item, protocolId, index + 1))
    .filter((item) => item.photoId)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item, index) => ({ ...item, order: index + 1 }));
}

function normalizeOverviewPhotoRef(item = {}, protocolId = state.current?.id || "", order = 1) {
  const now = new Date().toISOString();
  return {
    id: item.id || uid("overview"),
    protocolId: item.protocolId || protocolId || "",
    photoId: item.photoId || item.photo?.id || item.id || "",
    caption: item.caption || item.note || "",
    order: numberOrDefault(item.order, order),
    isCover: !!item.isCover,
    createdAt: item.createdAt || now,
    updatedAt: item.updatedAt || item.createdAt || now
  };
}

function applyMarkStageSize() {
  const stage = $("#markStage");
  const size = markStageSize();
  stage.style.width = `${size.width}px`;
  stage.style.height = `${size.height}px`;
  stage.style.minWidth = `${size.width}px`;
  stage.style.minHeight = `${size.height}px`;
  stage.style.transform = "none";
  $("#markPinLayer").style.width = "100%";
  $("#markPinLayer").style.height = "100%";
  const image = visibleMarkElement();
  if (image) {
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.transform = "none";
  }
  return size;
}

function clampMarkPan() {
  applyMarkStageSize();
}

function applyMarkTransform() {
  applyMarkStageSize();
}

function setMarkZoom(zoom, centerX, centerY) {
  const viewer = $(".mark-viewer");
  if (!viewer || !state.mark.naturalWidth || !state.mark.naturalHeight) return;
  const rect = viewer.getBoundingClientRect();
  const oldZoom = state.mark.zoom || state.mark.fitScale || 1;
  const centerInViewerX = centerX === undefined ? viewer.clientWidth / 2 : centerX - rect.left;
  const centerInViewerY = centerY === undefined ? viewer.clientHeight / 2 : centerY - rect.top;
  const naturalX = (viewer.scrollLeft + centerInViewerX) / oldZoom;
  const naturalY = (viewer.scrollTop + centerInViewerY) / oldZoom;
  const minScale = Math.max(0.02, state.mark.fitScale || 0.02);
  state.mark.zoom = Math.min(6, Math.max(minScale, zoom));
  const size = applyMarkStageSize();
  viewer.scrollLeft = Math.max(0, Math.min(size.width - viewer.clientWidth, naturalX * state.mark.zoom - centerInViewerX));
  viewer.scrollTop = Math.max(0, Math.min(size.height - viewer.clientHeight, naturalY * state.mark.zoom - centerInViewerY));
  renderMarkSelectors();
}

function fitMarkPlan() {
  const viewer = $(".mark-viewer");
  const target = visibleMarkElement();
  if (!viewer || !target) return;
  if (target.tagName === "IMG" && (!target.complete || !target.naturalWidth)) {
    target.addEventListener("load", () => requestAnimationFrame(fitMarkPlan), { once: true });
    return;
  }
  requestAnimationFrame(() => {
    const viewerRect = viewer.getBoundingClientRect();
    const viewerWidth = Math.max(1, viewerRect.width || viewer.clientWidth || 1);
    const viewerHeight = Math.max(1, viewerRect.height || viewer.clientHeight || 1);
    const imageWidth = Math.max(1, state.mark.naturalWidth || target.naturalWidth || target.width || 1);
    const imageHeight = Math.max(1, state.mark.naturalHeight || target.naturalHeight || target.height || 1);
    const fitScale = Math.min(viewerWidth / imageWidth, viewerHeight / imageHeight);
    state.mark.fitScale = Math.max(0.001, fitScale || 1);
    state.mark.zoom = state.mark.fitScale;
    const size = applyMarkStageSize();
    viewer.scrollLeft = Math.max(0, (size.width - viewerWidth) / 2);
    viewer.scrollTop = Math.max(0, (size.height - viewerHeight) / 2);
    renderMarkSelectors();
  });
}

function renderMarkPins() {
  const layer = $("#markPinLayer");
  layer.innerHTML = "";
  state.current.pins
    .filter((pin) => pinHasPlacement(pin, state.mark.planId, state.mark.pageNumber))
    .forEach((pin) => {
      const placement = pinPlacements(pin).find((item) => item.planId === state.mark.planId && item.pageNumber === state.mark.pageNumber);
      const marker = document.createElement("span");
      marker.className = pinMarkerClass(pin);
      marker.textContent = pinLabel(pin);
      marker.dataset.markPin = pin.id;
      marker.classList.toggle("selected", pin.id === state.selectedPinId);
      marker.classList.toggle("moving", pin.id === state.mark.movePinId);
      marker.style.left = `${(placement?.x ?? pin.x) * 100}%`;
      marker.style.top = `${(placement?.y ?? pin.y) * 100}%`;
      layer.appendChild(marker);
    });
}

function renderMarkPinSheet(pinId = state.selectedPinId) {
  const sheet = $("#markPinSheet");
  if (!sheet) return;
  const pin = state.current?.pins?.find((item) => item.id === pinId);
  if (!pin) {
    sheet.classList.add("hidden");
    sheet.innerHTML = "";
    return;
  }
  const siteItem = pin.itemId ? findSiteControlItem(pin.itemId) : null;
  const sample = !siteItem && pin.sampleId ? findSample(pin.sampleId) : null;
  const check = sample ? findCheckBySample(sample.id) : (!isSiteControlProtocol() ? state.current?.checkpoints?.find((item) => item.id === pin.checkItemId) : null);
  const context = siteItem
    ? siteControlItemContext(siteItem)
    : `${check?.title || "Allgemeine Feststellung"}${sample ? ` \u00b7 Pr\u00fcfstelle ${sample.number}${sample.location ? ` \u00b7 ${escapeHtml(sample.location)}` : ""}` : ""}`;
  sheet.classList.remove("hidden");
  sheet.innerHTML = `
    <div class="sheet-head">
      <strong>${escapeHtml(pinLabel(pin))} \u00b7 ${escapeHtml(pin.title || siteItem?.type || check?.title || "Planmarkierung")}</strong>
      <button class="small-btn" type="button" data-close-mark-pin-sheet>Schlie\u00dfen</button>
    </div>
    <div class="grid compact-grid">
      <label>Status
        <select data-mark-pin-field="status">
          ${STATUSES.map((status) => `<option value="${escapeAttr(status)}" ${pin.status === status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
        </select>
      </label>
      <label class="voice-field">Titel / Bereich
        <input data-mark-pin-field="title" value="${escapeAttr(pin.title || "")}">
        <button class="mic-btn" type="button" data-voice-mark-pin="${pin.id}" data-voice-mark-field="title">Sprache</button>
      </label>
    </div>
    <label class="voice-field">Bemerkung
      <textarea data-mark-pin-field="note">${escapeHtml(pin.note || "")}</textarea>
      <button class="mic-btn" type="button" data-voice-mark-pin="${pin.id}" data-voice-mark-field="note">Sprache</button>
    </label>
    <p class="muted">${escapeHtml(context)}</p>
    <div class="sheet-photo-actions">
      <button class="secondary-btn" type="button" data-mark-pin-photo="camera">Foto aufnehmen</button>
      <button class="secondary-btn" type="button" data-mark-pin-photo="gallery">Foto aus Galerie ausw\u00e4hlen</button>
    </div>
    <div class="pin-sheet-photos">
      ${(pin.photos || []).length ? (pin.photos || []).map((photo) => `<figure class="sample-photo compact"><img data-photo-thumb="${photo.id}" alt="${escapeAttr(photo.name || "Foto")}">${photoBackupActions(photo)}</figure>`).join("") : `<span class="muted">Noch keine Fotos.</span>`}
    </div>
    <div class="sheet-actions">
      <button class="secondary-btn" type="button" data-move-mark-pin="${pin.id}">Pin verschieben</button>
      <button class="secondary-btn" type="button" data-reset-mark-pin="${pin.id}">Pin neu setzen</button>
      <button class="secondary-btn" type="button" data-return-sample-from-mark>${siteItem ? "Zur Feststellung zur\u00fcck" : "Zur Pr\u00fcfstelle zur\u00fcck"}</button>
      <button class="danger-btn" type="button" data-remove-mark-pin="${pin.id}">Pin entfernen</button>
    </div>
  `;
  hydratePhotoThumbs(sheet);
}

function hideMarkPinSheet() {
  const sheet = $("#markPinSheet");
  if (!sheet) return;
  sheet.classList.add("hidden");
  sheet.innerHTML = "";
}

function startMoveMarkPin(pinId) {
  const pin = state.current?.pins.find((item) => item.id === pinId);
  if (!pin || !currentMarkPlacement(pin)) {
    alert("Dieser Pin ist auf der aktuell angezeigten Planseite nicht platziert.");
    return;
  }
  state.selectedPinId = pin.id;
  state.mark.movePinId = pin.id;
  state.mark.active = false;
  hideMarkPinSheet();
  renderMarkPins();
  renderMarkSelectors();
}

function startResetMarkPin(pinId) {
  const pin = state.current?.pins.find((item) => item.id === pinId);
  if (!pin) return;
  state.selectedPinId = pin.id;
  state.mark.movePinId = "";
  state.mark.active = true;
  hideMarkPinSheet();
  renderMarkPins();
  renderMarkSelectors();
}

function cancelMarkPinPlacement() {
  const pinId = state.mark.movePinId || state.selectedPinId;
  state.mark.movePinId = "";
  state.mark.active = false;
  renderMarkPins();
  renderMarkSelectors();
  if (pinId) renderMarkPinSheet(pinId);
}

function moveMarkPinTo(clientX, clientY) {
  const pin = state.current?.pins.find((item) => item.id === state.mark.movePinId);
  const stage = $("#markStage");
  if (!pin || !stage) return;
  const rect = stage.getBoundingClientRect();
  if (rect.width < 20 || rect.height < 20) return;
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
    $("#markHint").innerHTML = `Bitte innerhalb des Plans tippen. <button class="small-btn" type="button" data-cancel-mark-pin-move>Abbrechen</button>`;
    return;
  }
  const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
  const placements = pinPlacements(pin);
  let placement = placements.find((item) => item.planId === state.mark.planId && item.pageNumber === state.mark.pageNumber);
  if (!placement) {
    placement = { id: uid("placement"), planId: state.mark.planId, pageNumber: state.mark.pageNumber, x, y, label: "", isPrimary: !placements.length };
    placements.push(placement);
  }
  placement.x = x;
  placement.y = y;
  placement.planId = state.mark.planId;
  placement.pageNumber = state.mark.pageNumber;
  pin.placements = placements;
  if (placement.isPrimary || pin.planId === state.mark.planId && pin.pageNumber === state.mark.pageNumber) {
    pin.planId = placement.planId;
    pin.pageNumber = placement.pageNumber;
    pin.x = x;
    pin.y = y;
    pin.xPercent = x;
    pin.yPercent = y;
  }
  pin.updatedAt = new Date().toISOString();
  state.selectedPinId = pin.id;
  state.mark.movePinId = "";
  const siteItem = pin.itemId ? findSiteControlItem(pin.itemId) : null;
  if (siteItem && isSiteControlProtocol()) {
    syncSiteControlItemPinReference(siteItem, pin);
    saveSiteControlForm();
    renderMarkPins();
    renderMarkPinSheet(pin.id);
    renderMarkSelectors();
    renderSiteControlEditor();
    return;
  }
  saveFromForm();
  renderMarkPins();
  renderMarkPinSheet(pin.id);
  renderMarkSelectors();
  renderPlan();
  renderChecklist();
}

function removeMarkPin(pinId) {
  const pin = state.current?.pins?.find((item) => item.id === pinId);
  if (!pin) return;
  state.current.pins = state.current.pins.filter((item) => item.id !== pinId);
  if (isSiteControlProtocol()) {
    (state.current.siteItems || []).forEach((item) => {
      if (item.pinId === pinId) clearSiteControlItemPin(item);
    });
    if (state.selectedPinId === pinId) state.selectedPinId = "";
    saveSiteControlForm();
    renderMarkPins();
    renderMarkPinSheet("");
    renderSiteControlEditor();
    return;
  }
  state.current.checkpoints.forEach((check) => {
    if (check.pinId === pinId) check.pinId = "";
    (check.samples || []).forEach((sample) => {
      if (sample.pinId === pinId) {
        sample.pinId = "";
        sample.planId = "";
        sample.pageNumber = 1;
        if (sample.overlapCheck?.pinId === pinId) sample.overlapCheck.pinId = "";
      }
    });
  });
  if (state.selectedPinId === pinId) state.selectedPinId = "";
  saveFromForm();
  renderMarkPins();
  renderMarkPinSheet("");
  renderChecklist();
  renderPlan();
}

function placeSamplePin(clientX, clientY) {
  const sample = findSample(state.mark.sampleId);
  const check = sample ? findCheckBySample(sample.id) : null;
  const plan = planById(state.mark.planId);
  const stage = $("#markStage");
  if (!sample || !check || !plan || !stage) return;
  const rect = stage.getBoundingClientRect();
  if (rect.width < 20 || rect.height < 20) return;
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
  const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
  let pin = sample.pinId ? state.current.pins.find((item) => item.id === sample.pinId) : null;
  const now = new Date().toISOString();
  if (!pin) {
    pin = {
      id: uid("pin"),
      projectId: state.current.projectId,
      protocolId: state.current.id,
      number: nextPinNumber(),
      checkItemId: check.id,
      sampleId: sample.id,
      planId: plan.id,
      pageNumber: state.mark.pageNumber,
      x,
      y,
      xPercent: x,
      yPercent: y,
      placements: [],
      title: sample.location || check.title,
      status: sample.status || check.status || "teilweise / Auflage",
      note: sample.note || "",
      photos: [],
      checkpointIds: [check.id],
      createdAt: now,
      updatedAt: now
    };
    state.current.pins.push(pin);
  }
  pin.checkItemId = check.id;
  pin.sampleId = sample.id;
  pin.planId = plan.id;
  pin.pageNumber = state.mark.pageNumber;
  pin.x = x;
  pin.y = y;
  pin.xPercent = x;
  pin.yPercent = y;
  pin.title = sample.location || pin.title || check.title;
  pin.status = sample.status || pin.status;
  pin.note = sample.note || pin.note || "";
  pin.updatedAt = now;
  pin.checkpointIds = Array.from(new Set([...(pin.checkpointIds || []), check.id]));
  pin.placements = pinPlacements(pin).filter((placement) => !(placement.planId === plan.id && placement.pageNumber === state.mark.pageNumber));
  pin.placements.push({ id: uid("placement"), planId: plan.id, pageNumber: state.mark.pageNumber, x, y, label: "", isPrimary: true });
  pin.placements.forEach((placement) => { placement.isPrimary = placement.planId === plan.id && placement.pageNumber === state.mark.pageNumber; });
  sample.pinId = pin.id;
  sample.planId = plan.id;
  sample.pageNumber = state.mark.pageNumber;
  sample.updatedAt = now;
  if (sample.overlapCheck) {
    sample.overlapCheck.planId = plan.id;
    sample.overlapCheck.pageNumber = state.mark.pageNumber;
    sample.overlapCheck.pinId = pin.id;
  }
  state.selectedPinId = pin.id;
  state.selectedPlanId = plan.id;
  state.current.activePlanId = plan.id;
  state.mark.active = false;
  saveFromForm();
  renderMarkSelectors();
  renderMarkPins();
  renderMarkPinSheet(pin.id);
  renderChecklist();
  renderPlan();
}


function placeMarkPin(clientX, clientY) {
  if (state.markTarget?.kind === "site-control") {
    placeSiteControlPin(clientX, clientY);
    return;
  }
  placeSamplePin(clientX, clientY);
}

function placeSiteControlPin(clientX, clientY) {
  const item = findSiteControlItem(state.markTarget?.itemId || state.mark.siteItemId || "");
  const plan = planById(state.mark.planId);
  const stage = $("#markStage");
  if (!item || !plan || !stage) return;
  const rect = stage.getBoundingClientRect();
  if (rect.width < 20 || rect.height < 20) return;
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
  const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
  let pin = item.pinId ? state.current.pins.find((entry) => entry.id === item.pinId) : null;
  const now = new Date().toISOString();
  if (!pin) {
    pin = {
      id: uid("pin"),
      module: "site-control",
      projectId: state.current.projectId,
      protocolId: state.current.id,
      itemId: item.id,
      number: nextPinNumber(),
      planId: plan.id,
      pageNumber: state.mark.pageNumber,
      x,
      y,
      xPercent: x,
      yPercent: y,
      placements: [],
      title: item.location || item.type || "Feststellung",
      status: siteControlPinStatus(item.status),
      note: item.description || "",
      photos: [],
      createdAt: now,
      updatedAt: now
    };
    state.current.pins.push(pin);
  }
  pin.module = "site-control";
  pin.projectId = state.current.projectId;
  pin.protocolId = state.current.id;
  pin.itemId = item.id;
  pin.planId = plan.id;
  pin.pageNumber = state.mark.pageNumber;
  pin.x = x;
  pin.y = y;
  pin.xPercent = x;
  pin.yPercent = y;
  pin.title = item.location || pin.title || item.type || "Feststellung";
  pin.status = pin.status || siteControlPinStatus(item.status);
  pin.note = pin.note || item.description || "";
  pin.updatedAt = now;
  pin.placements = pinPlacements(pin).filter((placement) => !(placement.planId === plan.id && placement.pageNumber === state.mark.pageNumber));
  pin.placements.push({ id: uid("placement"), planId: plan.id, pageNumber: state.mark.pageNumber, x, y, label: "", isPrimary: true });
  pin.placements.forEach((placement) => { placement.isPrimary = placement.planId === plan.id && placement.pageNumber === state.mark.pageNumber; });
  syncSiteControlItemPinReference(item, pin);
  state.selectedPinId = pin.id;
  state.selectedPlanId = plan.id;
  state.mark.active = false;
  saveSiteControlForm();
  renderMarkSelectors();
  renderMarkPins();
  renderMarkPinSheet(pin.id);
  renderSiteControlEditor();
}

function barCountSummary(photo) {
  const analysis = normalizeBarCountAnalysis(photo?.barCountAnalysis);
  if (!analysis) return `<small class="muted">Fotoanalyse noch nicht erfasst.</small>`;
  const detected = analysis.detectedCount === "" ? "kein KI-Vorschlag" : `${analysis.detectedCount} erkannt`;
  const confirmed = analysis.confirmedCount === "" ? "nicht bestätigt" : `${analysis.confirmedCount} bestätigt`;
  return `<small class="muted">Fotoanalyse: ${escapeHtml(detected)}, ${escapeHtml(confirmed)}.</small>`;
}

function findPhotoRef(photoId) {
  if (!state.current || !photoId) return null;
  for (const pin of state.current.pins || []) {
    const found = (pin.photos || []).find((photo) => photo.id === photoId);
    if (found) return found;
  }
  for (const check of state.current.checkpoints || []) {
    const checkPhoto = (check.photos || []).find((photo) => photo.id === photoId);
    if (checkPhoto) return checkPhoto;
    for (const sample of check.samples || []) {
      const samplePhoto = (sample.photos || []).find((photo) => photo.id === photoId);
      if (samplePhoto) return samplePhoto;
    }
  }
  return null;
}

function openBarCountDialog(photoId) {
  const photo = findPhotoRef(photoId);
  if (!photo) return alert("Foto nicht gefunden.");
  const analysis = normalizeBarCountAnalysis(photo.barCountAnalysis) || {
    photoId,
    mode: "assistive",
    selectedRegion: null,
    direction: "auto",
    detectedCount: "",
    confirmedCount: "",
    confidence: "",
    userConfirmed: false,
    note: ""
  };
  $("#barCountPhotoId").value = photoId;
  $("#barCountDirectionInput").value = analysis.direction || "auto";
  $("#barCountDetectedInput").value = analysis.detectedCount === "" ? "" : analysis.detectedCount;
  $("#barCountConfirmedInput").value = analysis.confirmedCount === "" ? "" : analysis.confirmedCount;
  $("#barCountNoteInput").value = analysis.note || "";
  $("#barCountDialog").showModal();
}

async function saveBarCountAnalysis() {
  const photoId = $("#barCountPhotoId").value;
  const photo = findPhotoRef(photoId);
  if (!photo) return;
  const analysis = normalizeBarCountAnalysis({
    photoId,
    mode: "assistive",
    selectedRegion: null,
    direction: $("#barCountDirectionInput").value || "auto",
    detectedCount: numberOrEmpty($("#barCountDetectedInput").value),
    confirmedCount: numberOrEmpty($("#barCountConfirmedInput").value),
    confidence: "",
    userConfirmed: $("#barCountConfirmedInput").value !== "",
    note: $("#barCountNoteInput").value || ""
  });
  photo.barCountAnalysis = analysis;
  const record = await idbGet("photos", photoId);
  if (record) await idbPut("photos", { ...record, barCountAnalysis: analysis });
  $("#barCountDialog").close();
  saveFromForm();
  renderChecklist();
  renderPhotoDialog();
}

function dataUrlToBlob(dataUrl) {
  const [header, base64 = ""] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] || "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function imageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

async function prepareImageForReport(srcOrBlob, options = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.78,
    mimeType = "image/jpeg",
    background = "#ffffff"
  } = options;
  const source = typeof srcOrBlob === "string" ? srcOrBlob : await blobToDataUrl(srcOrBlob);
  const image = await imageFromDataUrl(source);
  const sourceWidth = image.naturalWidth || image.width || 1;
  const sourceHeight = image.naturalHeight || image.height || 1;
  const scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (mimeType === "image/jpeg") {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(image, 0, 0, width, height);
  const safeBlob = await safeCanvasToBlob(canvas, mimeType, quality, "Reportbild");
  if (!safeBlob) throw new Error("Bild konnte aus Browser-Sicherheitsgründen nicht exportiert werden.");
  return blobToDataUrl(safeBlob);
}

async function reportPhotoDataUrl(photoId, options) {
  const key = `report-photo:${photoId}:${options?.maxWidth || 0}:${options?.maxHeight || 0}:${options?.quality || 0}`;
  state.reportImageCache ||= new Map();
  if (state.reportImageCache.has(key)) return state.reportImageCache.get(key);
  const record = await idbGet("photos", photoId);
  if (!record?.blob) return "";
  const dataUrl = await prepareImageForReport(record.blob, options);
  state.reportImageCache.set(key, dataUrl);
  return dataUrl;
}

async function getPlanObjectUrl(plan) {
  const key = `plan:${plan.id}`;
  if (state.objectUrls.has(key)) return state.objectUrls.get(key);
  const record = await idbGet("plans", plan.id);
  if (!record?.blob) throw new Error("Plan-Blob fehlt");
  const url = URL.createObjectURL(record.blob);
  state.objectUrls.set(key, url);
  return url;
}

async function getPhotoObjectUrl(photoId) {
  const key = `photo:${photoId}`;
  if (state.objectUrls.has(key)) return state.objectUrls.get(key);
  const record = await idbGet("photos", photoId);
  if (!record?.blob) return "";
  const url = URL.createObjectURL(record.blob);
  state.objectUrls.set(key, url);
  return url;
}

async function hydratePhotoThumbs(root = document) {
  const nodes = $$("[data-photo-thumb]", root);
  for (const node of nodes) {
    if (node.src) continue;
    const url = await getPhotoObjectUrl(node.dataset.photoThumb);
    if (url) node.src = url;
  }
}

function bindVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    $$(".mic-btn").forEach((btn) => {
      btn.disabled = true;
      btn.title = "Spracherkennung in diesem Browser nicht verfügbar";
    });
    return;
  }
  document.addEventListener("input", (event) => {
    if (event.target.matches('#projectZipInput, [name="siteZip"], [data-master-field="address.zip"], [data-project-address-zip]')) {
      applyPostalCitySuggestion(event.target);
    }
  });
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".mic-btn");
    if (!btn || btn.disabled) return;
    event.preventDefault();
    event.stopPropagation();
    if (state.voice?.active) {
      if (state.voice.button === btn && state.voice.recognition) {
        state.voice.stoppedByUser = true;
        try { state.voice.recognition.stop(); } catch {}
      }
      return;
    }
    state.voice = {
      active: true,
      recognition: null,
      button: btn,
      baseText: getVoiceTargetText(btn),
      finalText: "",
      finalResults: {},
      finalChunks: [],
      stoppedByUser: false,
      restartAttempts: 0,
      lastSpeechAt: Date.now(),
      silenceTimeoutMs: 5000
    };
    const recognition = new SpeechRecognition();
    state.voice.recognition = recognition;
    recognition.lang = btn.dataset.voiceLang || "de-DE";
    recognition.interimResults = true;
    recognition.continuous = true;
    btn.dataset.originalLabel = btn.textContent || "Mikrofon";
    btn.textContent = "Stoppen";
    btn.classList.add("is-listening");
    $$(".mic-btn").forEach((item) => {
      if (item !== btn) item.disabled = true;
    });
    recognition.onresult = (resultEvent) => {
      if (!state.voice || state.voice.button !== btn) return;
      state.voice.lastSpeechAt = Date.now();
      for (let index = resultEvent.resultIndex; index < resultEvent.results.length; index += 1) {
        const result = resultEvent.results[index];
        if (!result.isFinal) continue;
        const transcript = cleanDictationText(result[0]?.transcript || "");
        if (transcript) {
          state.voice.finalResults[index] = transcript;
        }
      }
      state.voice.finalChunks = Object.keys(state.voice.finalResults || {})
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => state.voice.finalResults[key])
        .filter(Boolean);
      state.voice.finalText = normalizeSpeechRecognitionTranscript(state.voice.finalChunks);
    };
    recognition.onerror = (errorEvent) => {
      if (!state.voice || state.voice.button !== btn) return;
      if (errorEvent.error !== "aborted" && errorEvent.error !== "no-speech") {
        state.voice.stoppedByUser = true;
        const isAlbanian = btn.dataset.voiceLang === "sq-AL";
        alert(isAlbanian ? "Albanische Spracheingabe wird auf diesem Gerät/Browser nicht unterstützt. Bitte Text eintippen oder Deutsch verwenden." : "Spracherkennung konnte nicht gestartet werden.");
      }
    };
    recognition.onend = () => {
      if (!state.voice || state.voice.button !== btn) return;
      const elapsed = Date.now() - (state.voice.lastSpeechAt || Date.now());
      if (!state.voice.stoppedByUser && elapsed < state.voice.silenceTimeoutMs && state.voice.restartAttempts < 4) {
        state.voice.restartAttempts += 1;
        try { recognition.start(); return; } catch {}
      }
      const finalText = (state.voice?.button === btn ? state.voice.finalText : "").trim();
      resetVoiceButton(btn);
      if (finalText) insertVoiceText(btn, finalText);
      state.voice = { active: false, recognition: null, button: null, baseText: "", finalText: "", finalResults: {}, finalChunks: [], stoppedByUser: false };
    };
    try {
      recognition.start();
    } catch {
      resetVoiceButton(btn);
      state.voice = { active: false, recognition: null, button: null, baseText: "", finalText: "", finalResults: {} };
      const isAlbanian = btn.dataset.voiceLang === "sq-AL";
      alert(isAlbanian ? "Albanische Spracheingabe wird auf diesem Gerät/Browser nicht unterstützt. Bitte Text eintippen oder Deutsch verwenden." : "Spracherkennung konnte nicht gestartet werden.");
    }
  });
}

function resetVoiceButton(btn) {
  btn.textContent = btn.dataset.originalLabel || "Mikrofon";
  btn.classList.remove("is-listening");
  delete btn.dataset.originalLabel;
  $$(".mic-btn").forEach((item) => {
    item.disabled = false;
  });
}

function cleanDictationText(text = "") {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function dictationWordKey(word = "") {
  return String(word || "")
    .toLowerCase()
    .replace(/[.,;:!?"'„“”]/g, "")
    .replace(/[\u2010-\u2015-]/g, "")
    .trim();
}

function removeIncrementalPrefixes(text = "") {
  const words = cleanDictationText(text).split(" ").filter(Boolean);
  const output = [];
  let index = 0;
  while (index < words.length) {
    if (output.length) {
      let matchesOutputPrefix = true;
      for (let offset = 0; offset < output.length; offset += 1) {
        if (index + offset >= words.length || dictationWordKey(words[index + offset]) !== dictationWordKey(output[offset])) {
          matchesOutputPrefix = false;
          break;
        }
      }
      if (matchesOutputPrefix) {
        index += output.length;
        continue;
      }
    }
    output.push(words[index]);
    index += 1;
  }
  return output.join(" ");
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function capitalizeSentenceStarts(text = "") {
  return String(text || "").replace(/(^|[.!?]\s+)([a-zäöü])/g, (match, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
}

function dedupeDictationConstructionFragments(text = "") {
  let value = cleanDictationText(text);
  const patterns = [
    [/\b(Die Anschlussbewehrung für die Doppelwände im Bereich des rechten Kranfundaments)\s+\1\s+fehlt noch\b/gi, "$1 fehlt noch"],
    [/\b(Die Anschlussbewehrung für die Doppelwände ist teilweise nicht vertikal)\s+\1\s+eingebaut\b/gi, "$1 eingebaut"],
    [/\b(Die Zulagen im Bereich der Vertiefung der Bodenplatte für die später einzubauende Rinne sind zu tief eingebaut)\s+\1\b/gi, "$1"]
  ];
  patterns.forEach(([pattern, replacement]) => {
    value = value.replace(pattern, replacement);
  });
  return value;
}

function polishDictationText(text = "") {
  let value = cleanDictationText(text);
  if (!value) return "";

  const phraseReplacements = [
    [/\banschlussbewertung\b/gi, "Anschlussbewehrung"],
    [/\banschluss\s*bewehrung\b/gi, "Anschlussbewehrung"],
    [/\banschlussBewehrung\b/g, "Anschlussbewehrung"],
    [/\bkranfundaments\b/gi, "Kranfundaments"],
    [/\bkranfundament\b/gi, "Kranfundament"],
    [/\bdoppelwände\b/gi, "Doppelwände"],
    [/\bwu\s*-?\s*bodenplatte\b/gi, "WU-Bodenplatte"],
    [/\bmindestdicke\b/gi, "Mindestdicke"],
    [/\bquerbewehrung\b/gi, "Querbewehrung"],
    [/\bvertiefung\b/gi, "Vertiefung"],
    [/\brinne\b/gi, "Rinne"],
    [/\bfugenbleche\b/gi, "Fugenbleche"],
    [/\bspäter einzubauen der Rinne\b/gi, "später einzubauende Rinne"],
    [/\bmatten\s+lage\b/gi, "Mattenlage"],
    [/\buntergeschoss\s*[- ]\s*grundriss\b/gi, "Untergeschoss-Grundriss"],
    [/\bbeton\s+deckung\b/gi, "Betondeckung"],
    [/\bist\s+zu\s+gering\s+ist\s+müssen\b/gi, "ist zu gering. Es müssen"],
    [/\bist\s+zu\s+gering\s+es\s+müssen\b/gi, "ist zu gering. Es müssen"],
    [/\bist\s+zu\s+niedrig\s+die\s+obere\b/gi, "ist zu niedrig. Die obere"],
    [/\bsind\s+zu\s+niedrig\s+die\s+obere\b/gi, "sind zu niedrig. Die obere"],
    [/\bsind\s+teilweise\s+zu\s+niedrig\s+die\s+obere\b/gi, "sind teilweise zu niedrig. Die obere"],
    [/,\s*sie\s+muss\b/gi, ". Sie muss"],
    [/\bwerden\s+die\s+Bügel\b/gi, "werden. Die Bügel"],
    [/\bwerden\s+die\s+Unterstützungskörbe\b/gi, "werden. Die Unterstützungskörbe"],
    [/\bbetoniert\s+die\b/gi, "betoniert. Die"],
    [/\bumgebaut\s+werden\s+die\b/gi, "umgebaut werden. Die"],
    [/\bmuss\s+umgebaut\s+werden\s+die\b/gi, "muss umgebaut werden. Die"]
  ];
  phraseReplacements.forEach(([pattern, replacement]) => {
    value = value.replace(pattern, replacement);
  });

  const technicalTerms = [
    ["übergreifungslängen", "Übergreifungslängen"],
    ["übergreifungslänge", "Übergreifungslänge"],
    ["anschlussbewehrung", "Anschlussbewehrung"],
    ["mattenlage", "Mattenlage"],
    ["unterstützungskörbe", "Unterstützungskörbe"],
    ["betondeckung", "Betondeckung"],
    ["bodenplatte", "Bodenplatte"],
    ["untergeschoss", "Untergeschoss"],
    ["grundriss", "Grundriss"],
    ["verbau", "Verbau"],
    ["betonage", "Betonage"],
    ["zulagen", "Zulagen"],
    ["bewehrungslage", "Bewehrungslage"],
    ["bewehrung", "Bewehrung"],
    ["schalung", "Schalung"],
    ["sauberkeit", "Sauberkeit"],
    ["fundamenterder", "Fundamenterder"],
    ["fugenbleche", "Fugenbleche"],
    ["einbauteile", "Einbauteile"],
    ["bügel", "Bügel"],
    ["abstandhalter", "Abstandhalter"],
    ["durchstanzbewehrung", "Durchstanzbewehrung"],
    ["doppelwände", "Doppelwände"],
    ["kranfundament", "Kranfundament"],
    ["kranfundaments", "Kranfundaments"],
    ["wu-bodenplatte", "WU-Bodenplatte"],
    ["mindestdicke", "Mindestdicke"],
    ["querbewehrung", "Querbewehrung"],
    ["vertiefung", "Vertiefung"],
    ["rinne", "Rinne"]
  ];
  technicalTerms.forEach(([raw, replacement]) => {
    value = value.replace(new RegExp(escapeRegExp(raw), "gi"), replacement);
  });

  value = value.replace(/\bAnschlussBewehrung\b/g, "Anschlussbewehrung");
  value = dedupeDictationConstructionFragments(value);
  value = value
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/([.!?])(?=\S)/g, "$1 ")
    .replace(/\.{2,}/g, ".")
    .replace(/\s+/g, " ")
    .trim();
  value = capitalizeSentenceStarts(value);
  if (!/[.!?]$/.test(value)) value += ".";
  return value;
}

function polishedReportText(text = "") {
  return polishDictationText(text || "");
}
function normalizeSpeechRecognitionTranscript(chunks = []) {
  const list = Array.isArray(chunks) ? chunks : [chunks];
  const merged = [];
  for (const raw of list) {
    const text = removeIncrementalPrefixes(cleanDictationText(raw || ""));
    if (!text) continue;
    const key = normalizeDictationKey(text);
    const previous = merged[merged.length - 1] || "";
    const previousKey = normalizeDictationKey(previous);
    if (!key) continue;
    if (previousKey && key.startsWith(previousKey)) {
      merged[merged.length - 1] = text;
      continue;
    }
    if (previousKey && previousKey.startsWith(key)) continue;
    if (merged.some((item) => normalizeDictationKey(item) === key)) continue;
    merged.push(text);
  }
  return polishDictationText(removeIncrementalPrefixes(merged.join(" ")));
}

function normalizeDictationKey(text = "") {
  return cleanDictationText(text).toLowerCase().replace(/[.,;:!?\-–—"'„“”]/g, "").replace(/\s+/g, " ").trim();
}

function appendVoiceText(existing, addition) {
  const left = cleanDictationText(existing || "");
  const right = cleanDictationText(addition || "");
  if (!right) return polishDictationText(left);
  if (!left) return polishDictationText(right);
  const leftKey = normalizeDictationKey(left);
  const rightKey = normalizeDictationKey(right);
  if (leftKey.endsWith(rightKey) || leftKey.includes(` ${rightKey} `)) return polishDictationText(left);
  return polishDictationText(`${left}${/[.!?:;]$/.test(left) ? " " : ". "}${right}`);
}

function getVoiceTargetText(btn) {
  if (btn.dataset.voiceFor) {
    return $(`[name="${btn.dataset.voiceFor}"]`)?.value || "";
  }
  if (btn.dataset.voicePin) {
    return state.current?.pins.find((item) => item.id === btn.dataset.voicePin)?.note || "";
  }
  if (btn.dataset.voiceCheck) {
    return state.current?.checkpoints.find((item) => item.id === btn.dataset.voiceCheck)?.note || "";
  }
  if (btn.dataset.voiceMarkPin) {
    const pin = state.current?.pins.find((item) => item.id === btn.dataset.voiceMarkPin);
    return pin?.[btn.dataset.voiceMarkField || "note"] || "";
  }
  if (btn.dataset.voiceSample) {
    return findSample(btn.dataset.voiceSample)?.note || "";
  }
  if (btn.dataset.voiceSiteItem) {
    return findSiteControlItem(btn.dataset.voiceSiteItem)?.description || "";
  }
  if (btn.dataset.voiceDailyField) {
    return state.current?.dailyReport?.[btn.dataset.voiceDailyField] || "";
  }
  return "";
}

function insertVoiceText(btn, text) {
  if (btn.dataset.voiceFor) {
    const field = $(`[name="${btn.dataset.voiceFor}"]`);
    field.value = appendVoiceText(field.value, text);
    if (isSiteControlProtocol() && field.closest("#siteControlForm")) saveSiteControlForm();
    else saveFromForm();
  }
  if (btn.dataset.voicePin) {
    const pin = state.current.pins.find((item) => item.id === btn.dataset.voicePin);
    pin.note = appendVoiceText(pin.note, text);
    saveFromForm();
    renderPinEditor();
  }
  if (btn.dataset.voiceCheck) {
    const check = state.current.checkpoints.find((item) => item.id === btn.dataset.voiceCheck);
    check.note = appendVoiceText(check.note, text);
    saveFromForm();
    renderChecklist();
  }
  if (btn.dataset.voiceMarkPin) {
    const pin = state.current?.pins.find((item) => item.id === btn.dataset.voiceMarkPin);
    if (!pin) return;
    const fieldName = btn.dataset.voiceMarkField || "note";
    const field = $(`[data-mark-pin-field="${fieldName}"]`, btn.closest("#markPinSheet") || document);
    pin[fieldName] = appendVoiceText(pin[fieldName] || "", text);
    pin.updatedAt = new Date().toISOString();
    if (field) field.value = pin[fieldName];
    const siteItem = pin.itemId ? findSiteControlItem(pin.itemId) : null;
    const sample = !siteItem && pin.sampleId ? findSample(pin.sampleId) : null;
    if (sample && fieldName === "note") {
      sample.note = pin.note;
      sample.updatedAt = pin.updatedAt;
    }
    if (siteItem && fieldName === "note") {
      siteItem.description = pin.note || siteItem.description || "";
      syncSiteControlItemPinReference(siteItem, pin);
    }
    persist();
    renderMarkPins();
  }
  if (btn.dataset.voiceSample) {
    const sample = findSample(btn.dataset.voiceSample);
    if (!sample) return;
    sample.note = appendVoiceText(sample.note, text);
    sample.updatedAt = new Date().toISOString();
    saveFromForm();
    renderChecklist();
  }
  if (btn.dataset.voiceSiteItem) {
    const item = findSiteControlItem(btn.dataset.voiceSiteItem);
    if (!item) return;
    item.description = appendVoiceText(item.description, text);
    item.updatedAt = new Date().toISOString();
    persist();
    renderSiteControlEditor();
  }
  if (btn.dataset.voiceDailyField) {
    state.current.dailyReport = normalizeDailyReportMeta(state.current.dailyReport || {}, state.current);
    const fieldName = btn.dataset.voiceDailyField;
    const language = btn.dataset.voiceLang === "sq-AL" ? "sq" : (btn.dataset.voiceLang === "de-DE" ? "de" : state.current.dailyReport.inputLanguage || "de");
    if (fieldName === "workOriginal") {
      state.current.dailyReport.inputLanguage = language;
      state.current.dailyReport.workOriginal = appendVoiceText(state.current.dailyReport.workOriginal || "", text);
      if (language === "de") state.current.dailyReport.workGerman = appendVoiceText(state.current.dailyReport.workGerman || "", text);
      if (language === "sq") state.current.dailyReport.workAlbanian = appendVoiceText(state.current.dailyReport.workAlbanian || "", text);
      state.current.dailyReport.translationStatus = "nicht übersetzt";
    } else {
      if (fieldName === "voiceDraft") {
        state.current.dailyReport.inputLanguage = language;
        state.current.dailyReport.original_language = language;
      }
      state.current.dailyReport[fieldName] = appendVoiceText(state.current.dailyReport[fieldName] || "", text);
    }
    state.current.updatedAt = new Date().toISOString();
    persist();
    if (fieldName === "voiceDraft" || btn.dataset.voiceDailyMode === "full") {
      applyDailyVoiceExtraction(state.current.dailyReport.voiceDraft || text);
      return;
    }
    renderDailyReportEditor();
  }
}

async function fetchWeather() {
  const status = $("#weatherStatus");
  if (!navigator.geolocation) {
    status.textContent = "GPS nicht verfügbar.";
    return;
  }
  status.textContent = "Standort wird abgefragt...";
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    try {
      status.textContent = "Wetter wird geladen...";
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`;
      const response = await fetch(url);
      const data = await response.json();
      const current = data.current || {};
      $('[name="temperature"]').value = current.temperature_2m ? `${current.temperature_2m} °C` : "";
      $('[name="humidity"]').value = current.relative_humidity_2m ? `${current.relative_humidity_2m} %` : "";
      $('[name="wind"]').value = current.wind_speed_10m ? `${current.wind_speed_10m} km/h` : "";
      $('[name="precipitation"]').value = current.precipitation > 0 ? "ja" : "nein";
      $('[name="weatherCondition"]').value = weatherCode(current.weather_code);
      $('[name="weatherLocation"]').value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      const weatherStamp = nowLocalInput();
      const weatherTimeField = $('[name="weatherDateTime"]');
      if (weatherTimeField) weatherTimeField.value = weatherStamp;
      const inspectionTimeField = $('[name="inspectionDateTime"]');
      if (inspectionTimeField && !inspectionTimeField.value) inspectionTimeField.value = weatherStamp;
      saveFromForm();
      status.textContent = "Wetter übernommen, Baustellenzeit gesetzt und manuell änderbar.";
    } catch {
      status.textContent = "Wetterabruf fehlgeschlagen.";
    }
  }, () => {
    status.textContent = "Standortfreigabe abgelehnt.";
  }, { enableHighAccuracy: true, timeout: 12000 });
}

function weatherCode(code) {
  const map = {
    0: "klar", 1: "überwiegend klar", 2: "teilweise bewölkt", 3: "bedeckt",
    45: "Nebel", 48: "Reifnebel", 51: "leichter Nieselregen", 61: "leichter Regen",
    63: "Regen", 65: "starker Regen", 71: "Schnee", 80: "Regenschauer", 95: "Gewitter"
  };
  return map[code] || "Wettercode " + (code ?? "");
}

async function fillSiteControlWeatherFromLocation() {
  if (!isSiteControlProtocol()) return;
  const form = $("#siteControlForm");
  if (!form) return;
  if (!navigator.geolocation) {
    showAppToast("Standortabfrage ist in diesem Browser nicht verfügbar.", { type: "error" });
    return;
  }
  showAppToast("Standort wird abgefragt ...", { type: "info" });
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const current = data.current || {};
      const stamp = new Date().toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
      const temp = current.temperature_2m ?? "-";
      const wind = current.wind_speed_10m ?? "-";
      const condition = weatherCode(current.weather_code);
      const rain = Number(current.precipitation || 0) > 0 ? `, Niederschlag ${current.precipitation} mm` : "";
      form.elements.siteWeather.value = `Wetter automatisch ermittelt am ${stamp}: ${temp} °C, ${condition}, Wind ${wind} km/h${rain}. Standort: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}.`;
      saveSiteControlForm();
      showAppToast("Wetterdaten übernommen.", { type: "success" });
    } catch (error) {
      showAppToast("Wetterabruf fehlgeschlagen. Manuelle Eingabe bleibt möglich.", { type: "error" });
    }
  }, () => {
    showAppToast("Standortfreigabe abgelehnt. Manuelle Eingabe bleibt möglich.", { type: "info" });
  }, { enableHighAccuracy: true, timeout: 12000 });
}



function siteStatusClass(status = "") {
  const value = String(status || "").toLowerCase();
  if (value.includes("erledigt")) return "ok";
  if (value.includes("klär") || value.includes("bearbeitung")) return "partial";
  if (value.includes("offen") || value.includes("mangel") || value.includes("kritisch")) return "bad";
  return "neutral";
}

function findSiteControlItem(id) {
  return (state.current?.siteItems || []).find((item) => item.id === id) || null;
}

function siteControlItemIsOpen(item = {}) {
  const status = String(item.status || "").toLowerCase();
  return !status.includes("erledigt");
}

function createBlankSiteControl(projectId) {
  const project = projectById(projectId);
  const protocol = blankProtocol(project, {
    kind: PROTOCOL_KIND_SITE_CONTROL,
    head: {
      acceptanceTitle: `Baustellenkontrolle ${(nowLocalInput() || "").slice(0, 10)}`,
      acceptanceType: "Baustellenkontrolle",
      areaAxes: ""
    }
  });
  protocol.kind = PROTOCOL_KIND_SITE_CONTROL;
  protocol.checkpoints = [];
  protocol.plans = [];
  protocol.pins = [];
  protocol.siteControl = normalizeSiteControlMeta({ reason: "Regelbegehung" }, protocol);
  protocol.siteItems = [];
  protocol.result.resultStatus = "Baustellenkontrolle dokumentiert";
  protocol.result.finalNote = "";
  state.protocols.unshift(protocol);
  state.currentProjectId = protocol.projectId;
  persist();
  openSiteControlProtocol(protocol);
  showAppToast("Baustellenkontrolle gestartet.");
}

function openSiteControlProtocol(protocol) {
  state.current = normalizeProtocol(protocol);
  state.currentProjectId = state.current.projectId || "";
  const project = projectById(state.currentProjectId);
  if (project) syncProtocolProjectFields(state.current, project, { overwriteProtocol: false });
  showView("siteControlEditorView");
  renderSiteControlEditor();
}

function renderSiteControlView() {
  const list = $("#siteControlProjectList");
  if (!list) return;
  if (!state.projects.length) {
    list.innerHTML = `<div class="panel"><p class="muted">Noch keine Projekte vorhanden. Bitte zuerst ein Projekt anlegen.</p><button class="primary-btn" id="siteNewProjectBtn" type="button">Neues Projekt</button></div>`;
  } else {
    const visibleProjects = state.currentProjectId ? state.projects.filter((project) => project.id === state.currentProjectId) : [...state.projects];
    list.innerHTML = visibleProjects.sort((a, b) => (b.id === state.currentProjectId) - (a.id === state.currentProjectId)).map((project) => {
      const protocols = siteControlProtocolsForProject(project.id);
      const openCount = protocols.reduce((sum, protocol) => sum + (protocol.siteItems || []).filter(siteControlItemIsOpen).length, 0);
      return `
        <article class="project-card site-module-card">
          <div class="section-head">
            <div>
              <h3>${escapeHtml(project.name || "Unbenanntes Projekt")}</h3>
              <div class="muted">${escapeHtml(projectAddressText(project, { multiline: false }) || "Adresse offen")}</div>
              <div class="muted">${protocols.length} Baustellenkontrolle(n) · ${openCount} offene Punkte</div>
            </div>
            <button class="primary-btn" data-new-site-control="${project.id}" type="button">Baustellenkontrolle starten</button>
          </div>
          <div class="acceptance-list">
            ${protocols.length ? protocols.map((protocol) => `
              <article class="acceptance-card">
                <div>
                  <strong>${escapeHtml(protocol.head.acceptanceTitle || "Baustellenkontrolle")}</strong>
                  <div class="muted">${escapeHtml(formatDate(protocol.head.createdAt || protocol.createdAt))} · ${escapeHtml(protocol.siteControl?.reason || "Regelbegehung")}</div>
                  <div class="muted">${(protocol.siteItems || []).length} Feststellung(en) · ${(protocol.siteItems || []).filter(siteControlItemIsOpen).length} offen</div>
                </div>
                <div class="card-actions"><button class="secondary-btn" data-open-site-control="${protocol.id}" type="button">Öffnen</button></div>
              </article>`).join("") : `<div class="empty-card muted">Noch keine Baustellenkontrolle in diesem Projekt.</div>`}
          </div>
        </article>`;
    }).join("");
  }
  renderSiteControlOpenItems();
}

function renderSiteControlOpenItems() {
  const target = $("#siteControlOpenItems");
  if (!target) return;
  const openItems = [];
  state.protocols.filter(isSiteControlProtocol).filter((protocol) => !state.currentProjectId || protocol.projectId === state.currentProjectId).forEach((protocol) => {
    (protocol.siteItems || []).filter(siteControlItemIsOpen).forEach((item) => openItems.push({ protocol, item }));
  });
  target.innerHTML = `
    <section class="panel site-open-dashboard">
      <div class="section-head"><h3>Offene Punkte Baustellenkontrolle</h3><span class="status-badge ${openItems.length ? "bad" : "ok"}">${openItems.length}</span></div>
      ${openItems.length ? openItems.slice(0, 12).map(({ protocol, item }) => `
        <div class="site-open-row">
          <strong>${escapeHtml(item.type)} · ${escapeHtml(item.location || "ohne Bereich")}</strong>
          <span>${escapeHtml(projectById(protocol.projectId)?.name || protocol.head.projectName || "Projekt")}</span>
          <button class="small-btn" data-open-site-control="${protocol.id}" type="button">Öffnen</button>
        </div>`).join("") : `<p class="muted">Keine offenen Baustellenkontrollpunkte.</p>`}
    </section>`;
}

function renderSiteControlEditor() {
  const protocol = state.current;
  if (!isSiteControlProtocol(protocol)) return;
  const form = $("#siteControlForm");
  if (!form) return;
  const project = projectById(protocol.projectId);
  const meta = protocol.siteControl = normalizeSiteControlMeta(protocol.siteControl, protocol);
  form.elements.siteTitle.value = protocol.head.acceptanceTitle || "";
  form.elements.siteDate.value = protocol.head.createdAt || nowLocalInput();
  form.elements.siteProject.value = project?.name || protocol.head.projectName || "";
  const siteAddress = meta.address || protocol.head.siteAddress || projectAddressText(project, { multiline: false });
  form.elements.siteAddress.value = siteAddress;
  form.elements.siteReason.value = meta.reason || "Regelbegehung";
  form.elements.siteArea.value = meta.area || "";
  form.elements.siteParticipants.value = meta.participants || "";
  form.elements.siteWeather.value = meta.weather || "";
  form.elements.siteFinalNote.value = meta.finalNote || "";
  const title = $("#siteControlModeBanner");
  if (title) title.innerHTML = `<strong>Baustellenkontrolle</strong><span>${escapeHtml(project?.name || protocol.head.projectName || "Projekt")}</span>`;
  renderSiteControlItems();
  hydratePhotoThumbs($("#siteControlItemList"));
}

function saveSiteControlForm({ persistNow = true } = {}) {
  if (!isSiteControlProtocol()) return;
  const form = $("#siteControlForm");
  if (!form) return;
  const p = state.current;
  p.head.acceptanceTitle = form.elements.siteTitle.value || "Baustellenkontrolle";
  p.head.createdAt = form.elements.siteDate.value || p.head.createdAt || nowLocalInput();
  p.siteControl = {
    reason: form.elements.siteReason.value || "Regelbegehung",
    area: form.elements.siteArea.value || "",
    participants: form.elements.siteParticipants.value || "",
    address: form.elements.siteAddress.value || "",
    weather: form.elements.siteWeather.value || "",
    finalNote: form.elements.siteFinalNote.value || ""
  };
  const project = projectById(p.projectId);
  if (project) syncProtocolProjectFields(p, project, { overwriteProtocol: false });
  p.head.acceptanceType = "Baustellenkontrolle";
  p.head.areaAxes = p.siteControl.area;
  p.head.peoplePresent = p.siteControl.participants;
  p.head.siteAddress = p.siteControl.address || p.head.siteAddress;
  p.weather.weatherCondition = p.siteControl.weather;
  p.result.finalNote = p.siteControl.finalNote;
  p.updatedAt = new Date().toISOString();
  if (persistNow) persist(); else schedulePersist();
}

function addSiteControlItem(type = "Hinweis") {
  saveSiteControlForm({ persistNow: false });
  const now = new Date().toISOString();
  const item = normalizeSiteControlItems([{
    type,
    priority: type === "Mangel" ? "hoch" : "normal",
    status: "offen",
    createdAt: now,
    updatedAt: now
  }], state.current.id)[0];
  state.current.siteItems.push(item);
  persist();
  renderSiteControlEditor();
}

function renderSiteControlItems() {
  const list = $("#siteControlItemList");
  if (!list || !isSiteControlProtocol()) return;
  const items = state.current.siteItems || [];
  list.innerHTML = items.length ? items.map(siteControlItemCard).join("") : `<div class="empty-card muted">Noch keine Feststellung. Nutze oben + Mangel, + Aufgabe, + Hinweis oder + Foto-Doku.</div>`;
}

function siteControlOptions(values, current) {
  return uniqueValues(values).map((value) => `<option value="${escapeAttr(value)}" ${value === current ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");
}

function siteControlItemCard(item) {
  const photos = item.photos || [];
  const pin = siteControlPinForItem(item);
  const planReference = siteControlPlanReference(item, pin) || item.planReference || "";
  return `
    <article class="site-item-card" data-site-item="${item.id}">
      <div class="site-item-head">
        <h4>${escapeHtml(item.type)} ${item.number ? `#${item.number}` : ""}</h4>
        <span class="status-badge ${siteStatusClass(item.status)}">${escapeHtml(item.status)}</span>
      </div>
      <div class="grid site-item-grid">
        <label>Typ<select data-site-item-field="type">${siteControlOptions(state.masterData.siteControlTypes || SITE_CONTROL_TYPES, item.type)}</select></label>
        <label>Gewerk<input data-site-item-field="trade" list="tradeOptions" value="${escapeAttr(item.trade)}"></label>
        <label>Bereich / Ort<input data-site-item-field="location" value="${escapeAttr(item.location)}"></label>
        <label>Zust\u00e4ndig<input data-site-item-field="responsible" list="responsibleOptions" value="${escapeAttr(item.responsible)}"></label>
        <label>Frist<input data-site-item-field="dueDate" type="date" value="${escapeAttr(item.dueDate)}"></label>
        <label>Priorit\u00e4t<select data-site-item-field="priority">${siteControlOptions(state.masterData.siteControlPriorities || SITE_CONTROL_PRIORITIES, item.priority)}</select></label>
        <label>Status<select data-site-item-field="status">${siteControlOptions(SITE_CONTROL_STATUSES, item.status)}</select></label>
        <label>Planbezug / Pin<input data-site-item-field="planReference" value="${escapeAttr(item.planReference)}" placeholder="z. B. Plan B-002, P3"></label>
      </div>
      <div class="site-plan-reference ${pin ? "has-pin" : ""}">
        <div><strong>${pin ? "Planmarkierung" : "Kein Pin gesetzt"}</strong><span>${pin ? escapeHtml(planReference) : "Diese Feststellung kann auf einem Projektplan markiert werden."}</span></div>
        <div class="site-plan-actions">
          <button class="secondary-btn" type="button" data-mark-site-item="${item.id}">${pin ? "Pin neu setzen" : "Auf Plan markieren"}</button>
          ${pin ? `<button class="secondary-btn" type="button" data-show-site-pin="${item.id}">Pin anzeigen / bearbeiten</button><button class="danger-btn" type="button" data-remove-site-pin="${item.id}">Planbezug entfernen</button>` : ""}
        </div>
      </div>
      <label class="voice-field">Beschreibung / Feststellung
        <textarea data-site-item-field="description" rows="4">${escapeHtml(item.description)}</textarea>
        <button class="mic-btn" type="button" data-voice-site-item="${item.id}">Mikrofon</button>
      </label>
      <div class="result-actions site-photo-actions">
        <button class="secondary-btn" type="button" data-site-photo-camera="${item.id}">Foto aufnehmen</button>
        <button class="secondary-btn" type="button" data-site-photo-gallery="${item.id}">Foto aus Galerie ausw\u00e4hlen</button>
        <button class="danger-btn" type="button" data-delete-site-item="${item.id}">Feststellung l\u00f6schen</button>
      </div>
      <div class="photo-grid compact-photo-grid">
        ${photos.map((photo) => `
          <figure class="photo-tool-card">
            <img data-photo-thumb="${photo.id}" alt="${escapeAttr(photo.name || "Foto")}">
            <figcaption><span>${escapeHtml(photo.name || "Foto")}</span>${photoBackupActions(photo)}<button class="small-btn" type="button" data-delete-site-photo="${item.id}" data-photo-id="${photo.id}">Foto l\u00f6schen</button></figcaption>
          </figure>`).join("")}
      </div>
    </article>`;
}

function updateSiteControlItemField(element) {
  const item = findSiteControlItem(element.closest("[data-site-item]")?.dataset.siteItem || "");
  if (!item) return;
  item[element.dataset.siteItemField] = element.value || "";
  item.updatedAt = new Date().toISOString();
  persist();
  if (element.dataset.siteItemField === "status") renderSiteControlItems();
}

function triggerSiteControlPhotoPicker(itemId, source) {
  const target = { kind: "siteItem", id: itemId, source };
  state.photoTarget = target;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  if (source === "camera") input.setAttribute("capture", "environment");
  if (source === "gallery") input.multiple = true;
  input.className = "visually-hidden";
  input.addEventListener("change", async () => {
    await addPhotos(Array.from(input.files || []), target);
    input.remove();
  }, { once: true });
  document.body.appendChild(input);
  input.click();
}



function siteControlItemDescription(item = {}) {
  const pin = siteControlPinForItem(item);
  return item.description || pin?.note || item.planReference || "";
}

function siteControlItemPhotos(item = {}) {
  const pin = siteControlPinForItem(item);
  const seen = new Set();
  return [...(item.photos || []), ...(pin?.photos || [])].filter((photo) => {
    if (!photo?.id || seen.has(photo.id)) return false;
    seen.add(photo.id);
    return true;
  });
}

function applyDailyReportProjectAddress() {
  if (!isDailyReportProtocol()) return;
  const project = projectById(state.current.projectId);
  const text = projectAddressText(project, { multiline: false });
  const form = $("#dailyReportForm");
  if (!text) {
    showAppToast("Keine Projektadresse in den Stammdaten gefunden.", { type: "error" });
    return;
  }
  if (form?.elements?.dailyAddress) form.elements.dailyAddress.value = text;
  state.current.head.siteAddress = text;
  state.current.dailyReport = normalizeDailyReportMeta(state.current.dailyReport || {}, state.current);
  state.current.updatedAt = new Date().toISOString();
  persist();
  showAppToast("Adresse aus Projekt übernommen.", { type: "success" });
}

function siteControlPlanReferencesReport(items = []) {
  const rows = items
    .map((item) => ({ item, pin: siteControlPinForItem(item), ref: siteControlPlanReference(item) || item.planReference || "" }))
    .filter(({ ref }) => ref);
  if (!rows.length) return "";
  return `<div class="site-report-card"><div class="site-item-body">${rows.map(({ item, pin, ref }) => `<div class="info-row"><strong>${escapeHtml(pin ? pinLabel(pin) : "Planbezug")}</strong><span>${escapeHtml(ref)}<br><span class="muted">${escapeHtml(siteControlItemContext(item))}</span></span></div>`).join("")}</div></div>`;
}

function siteControlPinReportEntries(items = []) {
  const entries = [];
  for (const item of items) {
    const pin = siteControlPinForItem(item);
    if (!pin) continue;
    const placements = pinPlacements(pin);
    for (const placement of placements) {
      const planId = placement.planId || pin.planId || item.planId || "";
      if (!planId) continue;
      const plan = planById(planId);
      entries.push({
        item,
        pin,
        plan,
        planId,
        pageNumber: Math.max(1, Number(placement.pageNumber || pin.pageNumber || item.pageNumber) || 1),
        placement
      });
    }
  }
  return entries;
}

async function ensureSiteControlReportPlanImages(items = []) {
  state.reportPlanImages = new Map();
  state.reportImageCache ||= new Map();
  const seen = new Set();
  for (const entry of siteControlPinReportEntries(items)) {
    const plan = entry.plan;
    const key = `${entry.planId}:${entry.pageNumber}`;
    if (!plan || seen.has(key)) continue;
    seen.add(key);
    try {
      if (plan.type === "application/pdf") {
        const dataUrl = await renderPdfPageToDataUrl(plan, entry.pageNumber);
        state.reportPlanImages.set(key, await prepareImageForReport(dataUrl, { maxWidth: 2200, maxHeight: 2200, quality: 0.82, mimeType: "image/jpeg" }));
      } else {
        const record = await idbGet("plans", plan.id);
        if (!record?.blob) throw new Error("Planinhalt fehlt");
        const dataUrl = await prepareImageForReport(record.blob, { maxWidth: 2200, maxHeight: 2200, quality: 0.82, mimeType: "image/jpeg" });
        state.reportPlanImages.set(key, dataUrl);
      }
    } catch (error) {
      plan.renderError = `Plan zum Pin konnte nicht geladen werden. plan_id: ${entry.planId}, pin_id: ${entry.pin.id}. ${error?.message || ""}`.trim();
    }
  }
}

function siteControlPlanAppendixReport(items = []) {
  const entries = siteControlPinReportEntries(items);
  if (!entries.length) return siteControlPlanReferencesReport(items);
  const groups = new Map();
  for (const entry of entries) {
    const key = `${entry.planId}:${entry.pageNumber}`;
    if (!groups.has(key)) groups.set(key, { ...entry, rows: [] });
    groups.get(key).rows.push(entry);
  }
  return [...groups.values()].map((group, index) => {
    const plan = group.plan;
    const pins = [...new Map(group.rows.map((row) => [row.pin.id, row.pin])).values()];
    const image = state.reportPlanImages.get(`${group.planId}:${group.pageNumber}`);
    const title = plan ? `${displayPlanNumber(plan) || plan.fileName || "Plan"}${plan.title ? " – " + plan.title : ""}` : `Plan ${group.planId || "unbekannt"}`;
    return `
      <section class="appendix-block site-plan-appendix ${index ? "page-break" : ""}">
        <h3>Planmarkierung – ${escapeHtml(title)} – Seite ${group.pageNumber}</h3>
        ${image ? `<div class="plan"><img class="report-plan-image" src="${image}" alt="Plan">${reportPinCallouts(pins, group.planId, group.pageNumber)}</div>` : `<p class="report-warning">${escapeHtml(plan?.renderError || `Plan zum Pin konnte nicht geladen werden. plan_id: ${group.planId || "-"}, pin_id: ${pins.map((pin) => pin.id).join(", ") || "-"}`)}</p>`}
        <table class="pin-table"><thead><tr><th>Pin</th><th>Feststellung</th><th>Status</th><th>Bemerkung</th></tr></thead><tbody>
          ${group.rows.map(({ item, pin }) => `<tr><td><strong>${escapeHtml(pinLabel(pin))}</strong></td><td>${escapeHtml(siteControlItemContext(item))}</td><td>${escapeHtml(item.status || pin.status || "")}</td><td>${escapeHtml(siteControlItemDescription(item) || pin.note || "")}</td></tr>`).join("")}
        </tbody></table>
      </section>`;
  }).join("");
}
async function buildSiteControlReportParts() {
  saveSiteControlForm({ persistNow: false });
  const p = state.current;
  const project = projectById(p.projectId);
  const items = p.siteItems || [];
  const openItems = items.filter(siteControlItemIsOpen);
  const photoCards = [];
  for (const item of items) {
    for (const photo of siteControlItemPhotos(item)) {
      const url = await reportPhotoDataUrl(photo.id, { maxWidth: 1400, maxHeight: 1400, type: "image/jpeg", quality: 0.75 });
      if (url) photoCards.push({ item, photo, url });
    }
  }
  const css = `
    @page{size:A4;margin:18mm 15mm 20mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#1f2933;margin:0;line-height:1.45;background:#fff;font-size:12px}.print-btn{position:fixed;right:18px;top:18px;z-index:20;background:#1f4e79;color:#fff;border:0;border-radius:4px;padding:10px 14px;font-weight:700}.save-hint{position:sticky;top:0;z-index:19;background:#fff7d6;border-bottom:1px solid #e6c65c;color:#4f3b00;padding:12px 18px;font-size:13px;font-weight:700}.report-export,.report-page{width:190mm;max-width:190mm;margin:0 auto;background:#fff}.report-header{display:grid;grid-template-columns:1fr auto;gap:18px;border-bottom:3px solid #1f4e79;padding-bottom:18px;margin-bottom:22px}.brand{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#5b6773;font-weight:700}h1{font-size:28px;line-height:1.15;margin:6px 0 8px;color:#17212b}h2{font-size:17px;color:#17212b;margin:24px 0 12px;padding-bottom:7px;border-bottom:1.5px solid #aab4bf;break-after:avoid}h3{font-size:14px;margin:0 0 8px;color:#17212b}.muted{color:#697586}.doc-meta{min-width:185px;border:1px solid #d8dee6;border-radius:6px;padding:10px 12px;background:#f7f9fb}.doc-meta div{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #e4e8ee;padding:4px 0}.doc-meta div:last-child{border-bottom:0}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0 20px}.info-card,.site-report-card{border:1px solid #d8dee6;border-radius:8px;background:#fff;overflow:hidden;break-inside:avoid;margin:10px 0 14px}.info-card h3,.site-report-card h3{background:#f3f6f9;margin:0;padding:9px 11px;border-bottom:1px solid #d8dee6;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#4b5563}.info-row{display:grid;grid-template-columns:48mm 1fr;gap:10px;padding:8px 11px;border-bottom:1px solid #edf0f3}.info-row:last-child{border-bottom:0}.info-row strong{color:#52606d;font-size:11px}.status-badge{display:inline-block;border-radius:999px;padding:4px 10px;font-weight:800;font-size:11px;border:1px solid transparent}.status-badge.ok{background:#e7f6ee;color:#12663e;border-color:#adddc2}.status-badge.partial{background:#fff1d6;color:#8a5400;border-color:#f0c56c}.status-badge.bad{background:#ffe1df;color:#9f2a25;border-color:#efa6a1}.status-badge.neutral{background:#eef1f4;color:#4f5b67;border-color:#cfd6dd}.status-badge.doc{background:#e7f2f8;color:#1f5d78;border-color:#a9cfe0}.site-item-title{display:flex;justify-content:space-between;gap:10px;align-items:start;background:#f7f9fb;border-bottom:1px solid #d8dee6;padding:10px 12px}.site-item-body{padding:10px 12px}.site-item-body p{white-space:pre-wrap}.worker-table{width:100%;border-collapse:collapse;font-size:10.5px}.worker-table th,.worker-table td{border:1px solid #d8dee6;padding:5px 6px;text-align:left;vertical-align:top}.worker-table th{background:#f3f6f9;color:#4b5563}.photo-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.photo img{width:100%;height:165px;object-fit:cover;border:1px solid #cfd6dd;background:#fff}.photo p{font-size:10.5px;color:#697586;margin:5px 0 0}.plan{position:relative;width:100%;max-width:100%;display:block;border:1px solid #cfd6dd;background:#fff;padding:4px;break-inside:avoid;page-break-inside:avoid;overflow:visible}.plan img,.report-plan-image{width:100%;max-width:100%;height:auto;object-fit:contain;display:block}.pin-marker{position:absolute;width:0;height:0;overflow:visible;z-index:5}.pin-point{position:absolute;left:0;top:0;width:10px;height:10px;border-radius:50% 50% 50% 0;background:#fff;border:2px solid #1f2933;transform:translate(-50%,-100%) rotate(-45deg);box-shadow:0 1px 4px rgba(0,0,0,.28)}.pin-point:after{content:"";position:absolute;left:50%;top:50%;width:3px;height:3px;border-radius:50%;background:#1f2933;transform:translate(-50%,-50%)}.pin-leader{position:absolute;left:0;top:-6px;width:var(--line,10px);height:1px;background:rgba(31,41,51,.45);transform-origin:0 0;transform:rotate(var(--angle,-35deg))}.pin-chip{position:absolute;left:var(--dx,8px);top:var(--dy,-22px);transform:translateY(-50%);min-width:22px;height:18px;padding:0 6px;border-radius:5px;background:#fff;color:#1f2933;border:1.5px solid #4f6f8f;display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:800;line-height:1;box-shadow:0 1px 4px rgba(0,0,0,.2);white-space:nowrap}.pin-chip.ok{border-color:#168451}.pin-chip.partial{border-color:#c47a00}.pin-chip.bad{border-color:#c93c37}.pin-chip.neutral{border-color:#4f6f8f}.appendix-block{break-inside:avoid;page-break-inside:avoid;margin-bottom:18px}.site-plan-appendix h3{background:#f3f6f9;border:1px solid #d8dee6;border-bottom:0;border-radius:8px 8px 0 0;padding:9px 11px;margin:10px 0 0}.pin-table{width:100%;border-collapse:collapse;font-size:10.5px;margin-top:8px}.pin-table th,.pin-table td{border:1px solid #d8dee6;padding:5px 6px;text-align:left;vertical-align:top}.pin-table th{background:#f3f6f9}.report-warning{border:1px solid #f0c56c;background:#fff7d6;color:#5c4200;border-radius:6px;padding:10px 12px}.page-break{break-before:page;page-break-before:always}.footer-note{margin-top:28px;border-top:1px solid #d8dee6;padding-top:8px;color:#697586;font-size:10.5px;display:flex;justify-content:space-between;gap:12px}@media print{.print-btn,.save-hint{display:none}.report-export,.report-page{width:180mm;max-width:180mm;margin:0}.info-grid{grid-template-columns:1fr 1fr}.site-report-card,.photo{break-inside:avoid;page-break-inside:avoid}}
  `;
  const rows = [
    ["Projekt", project?.name || p.head.projectName],
    ["Adresse", projectAddressText(project, { multiline: false }) || formatAddress(p.head.siteAddress || p.head.siteAddressText || "") || "ohne Angabe"],
    ["Datum / Uhrzeit", formatDate(protocolInspectionDateTime(p))],
    ["Anlass", p.siteControl?.reason],
    ["Bereich", p.siteControl?.area],
    ["Teilnehmer", p.siteControl?.participants],
    ["Wetter / Bedingungen", p.siteControl?.weather]
  ];
  const itemHtml = items.length ? items.map((item) => `
    <article class="site-report-card">
      <div class="site-item-title"><div><strong>${escapeHtml(item.type)}</strong><div class="muted">${escapeHtml([item.trade, item.location].filter(Boolean).join(" · ") || "ohne Zuordnung")}</div></div><span class="status-badge ${siteStatusClass(item.status)}">${escapeHtml(item.status)}</span></div>
      <div class="site-item-body">
        ${infoRow("Zuständig", item.responsible)}${infoRow("Frist", item.dueDate)}${infoRow("Priorität", item.priority)}${infoRow("Planbezug / Pin", item.planReference)}
        <p>${escapeHtml(siteControlItemDescription(item) || "Keine Beschreibung erfasst.")}</p>
      </div>
    </article>`).join("") : `<p class="muted">Keine Feststellungen dokumentiert.</p>`;
  await ensureSiteControlReportPlanImages(items);
  const planReferenceHtml = siteControlPlanAppendixReport(items);
  const photoHtml = photoCards.length ? `<div class="photo-grid">${photoCards.map(({ item, photo, url }) => `<figure class="photo"><img src="${url}" alt="${escapeAttr(photo.name || "Foto")}"><figcaption><p><strong>${escapeHtml(item.type)}</strong> · ${escapeHtml(item.location || "ohne Bereich")}</p><p>${escapeHtml(photo.name || "Foto")}</p></figcaption></figure>`).join("")}</div>` : `<p class="muted">Keine Fotos dokumentiert.</p>`;
  const body = `
    <div class="report-export"><main class="report-page">
      <header class="report-header"><div><div class="brand">Kai BauSuite · Baustellenkontrolle</div><h1>Baustellenkontrolle</h1><p class="muted">Allgemeine Baustellenbegehung mit Feststellungen, Aufgaben, Fotos und offenen Punkten.</p></div><aside class="doc-meta"><div><span>Datum</span><strong>${escapeHtml(formatDate(protocolInspectionDateTime(p)))}</strong></div><div><span>Protokoll</span><strong>${escapeHtml(p.id.slice(-8).toUpperCase())}</strong></div></aside></header>
      <section class="info-grid"><div class="info-card"><h3>Projekt</h3>${rows.slice(0,3).map(([k,v]) => infoRow(k,v)).join("")}</div><div class="info-card"><h3>Kontrolle</h3>${rows.slice(3).map(([k,v]) => infoRow(k,v)).join("")}</div></section>
      <h2>Ergebnis / Zusammenfassung</h2><section class="info-card result-box">${infoRow("Offene Punkte", String(openItems.length))}${infoRow("Schlussbemerkung", p.siteControl?.finalNote || p.result?.finalNote || "")}</section>
      <h2>Offene Punkte</h2>${openItems.length ? openItems.map((item) => `<article class="site-report-card"><div class="site-item-title"><strong>${escapeHtml(item.type)} · ${escapeHtml(item.location || "ohne Bereich")}</strong><span class="status-badge ${siteStatusClass(item.status)}">${escapeHtml(item.status)}</span></div><div class="site-item-body"><p>${escapeHtml(siteControlItemDescription(item) || "")}</p></div></article>`).join("") : `<p class="muted">Keine offenen Punkte dokumentiert.</p>`}
      <h2>Feststellungen / Aufgaben</h2>${itemHtml}
      ${planReferenceHtml ? `<h2>Plananlagen / Markierungen</h2>${planReferenceHtml}` : ""}
      <h2 class="page-break">Fotodokumentation</h2>${photoHtml}
      <footer class="footer-note"><span>${escapeHtml(project?.name || p.head.projectName || "Kai BauSuite")}</span><span>${escapeHtml(formatDate(protocolInspectionDateTime(p)))}</span><span>Kai BauSuite</span></footer>
    </main></div>`;
  const title = sanitizeFileName(`Baustellenkontrolle_${project?.name || p.head.projectName || "Projekt"}_${(p.head.createdAt || "").slice(0,10)}`);
  return { css, body, title, fileName: `${title}.pdf` };
}﻿
function createBlankDailyReport(projectId) {
  const project = projectById(projectId || state.currentProjectId);
  if (!project) { showAppToast("Bitte zuerst ein Projekt auswählen.", { type: "error" }); return; }
  const date = (nowLocalInput() || "").slice(0, 10);
  const protocol = blankProtocol(project, { kind: PROTOCOL_KIND_DAILY_REPORT, head: { acceptanceTitle: `Bautagesbericht ${date}`, acceptanceType: "Bautagesbericht", createdAt: `${date}T08:00` } });
  protocol.kind = PROTOCOL_KIND_DAILY_REPORT;
  protocol.checkpoints = [];
  protocol.plans = [];
  protocol.pins = [];
  protocol.siteItems = [];
  protocol.dailyReport = normalizeDailyReportMeta({ date, status: "Entwurf", workStart: "07:00", workEnd: "16:00" }, protocol);
  protocol.result.resultStatus = "Bautagesbericht dokumentiert";
  state.protocols.unshift(protocol);
  state.currentProjectId = protocol.projectId;
  persist();
  openDailyReportProtocol(protocol);
  showAppToast("Bautagesbericht angelegt.");
}

function openDailyReportProtocol(protocol) {
  if (!protocol) return;
  state.current = normalizeProtocol(protocol);
  state.currentProjectId = state.current.projectId || "";
  const project = projectById(state.currentProjectId);
  if (project) syncProtocolProjectFields(state.current, project, { overwriteProtocol: false });
  showView("dailyReportEditorView");
  renderDailyReportEditor();
}

function dailyReportListCard(protocol) {
  const report = normalizeDailyReportMeta(protocol.dailyReport || {}, protocol);
  const project = projectById(protocol.projectId);
  const summary = report.workOriginal || report.workDescription || report.incidentsOriginal || "Noch keine Tätigkeiten dokumentiert.";
  const time = [report.workStart, report.workEnd].filter(Boolean).join(" - ") || "Arbeitszeit offen";
  return `<article class="acceptance-card"><div><h4>${escapeHtml(protocol.head.acceptanceTitle || "Bautagesbericht")}</h4><div class="muted">${escapeHtml(formatDate(report.date || protocol.head.createdAt || protocol.createdAt))} · ${escapeHtml(project?.name || protocol.head.projectName || "Projekt")}</div><div class="muted">${escapeHtml(time)} · ${escapeHtml(report.crew || "Kolonne offen")} · ${escapeHtml(report.status || "Entwurf")}</div><p class="muted">${escapeHtml(summary).slice(0, 180)}</p></div><div class="card-actions"><button class="secondary-btn" data-open-daily-report="${protocol.id}" type="button">Öffnen</button><button class="danger-btn" data-delete-daily-report="${protocol.id}" type="button">Löschen</button></div></article>`;
}

function renderDailyReportView() {
  const list = $("#dailyReportList");
  if (!list) return;
  const project = projectById(state.currentProjectId) || state.projects[0] || null;
  if (!project) { list.innerHTML = `<div class="panel"><p class="muted">Noch keine Projekte vorhanden. Bitte zuerst ein Projekt anlegen.</p><button class="primary-btn" id="siteNewProjectBtn" type="button">Neues Projekt</button></div>`; return; }
  state.currentProjectId = project.id;
  const reports = dailyReportProtocolsForProject(project.id);
  list.innerHTML = `<section class="panel project-hub-summary"><div><h3>${escapeHtml(project.name || "Projekt")}</h3><p class="muted">${escapeHtml(projectAddressText(project, { multiline: false }) || "Adresse offen")}</p></div><button class="primary-btn" data-new-daily-report="${project.id}" type="button">Neuer Bautagesbericht</button></section><section class="panel"><div class="acceptance-list">${reports.length ? reports.map(dailyReportListCard).join("") : `<div class="empty-card muted">Noch kein Bautagesbericht in diesem Projekt.</div>`}</div></section>`;
}

function normalizeMatchText(value = "") {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9äöüÄÖÜ\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function germanNumberFromText(text = "") {
  const normalized = normalizeMatchText(text);
  const digit = normalized.match(/\b(\d{1,2})\s*(mitarbeiter|mann|leute|personen|arbeiter)\b/);
  if (digit) return Number(digit[1]);
  const words = {
    ein: 1, eine: 1, einen: 1, einem: 1, eins: 1,
    zwei: 2, zweit: 2, drei: 3, dritt: 3, vier: 4, funf: 5, fuenf: 5,
    sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwolf: 12, zwoelf: 12
  };
  const phrase = normalized.match(/\bzu\s+(zweit|dritt|viert|funft|fuenft|sechst|siebt|acht|neunt|zehnt)\b/);
  if (phrase) return words[phrase[1].replace(/t$/, "")] || ({dritt: 3, viert: 4, funft: 5, fuenft: 5, sechst: 6, siebt: 7, acht: 8, neunt: 9, zehnt: 10})[phrase[1]] || "";
  for (const [word, value] of Object.entries(words)) {
    const pattern = new RegExp(`\\b${word}\\s*(mitarbeiter|mann|leute|personen|arbeiter)\\b`, "i");
    if (pattern.test(normalized)) return value;
  }
  return "";
}

function dailyEmployeeCandidates() {
  const master = normalizeMasterData(state.masterData);
  return (master.ownPersons || []).map((person) => ({
    id: person.id,
    name: person.name || "",
    company: person.company || "",
    role: person.role || "",
    aliases: uniqueValues(String(person.aliases || "").split(/[,;|]/).map((item) => item.trim()))
  })).filter((person) => person.name);
}

function findCompanyInText(text = "") {
  const normalized = normalizeMatchText(text);
  const companies = normalizeMasterData(state.masterData).companies || [];
  return companies.find((company) => {
    const label = normalizeMatchText(companyLabel(company));
    const name = normalizeMatchText(company.name || "");
    return (name && normalized.includes(name)) || (label && normalized.includes(label));
  }) || null;
}

function matchEmployeeName(rawName = "", companyName = "") {
  const value = normalizeMatchText(rawName);
  if (!value) return { status: "empty", matches: [] };
  const companyNorm = normalizeMatchText(companyName || "");
  let matches = dailyEmployeeCandidates().filter((person) => {
    const parts = [person.name, ...person.aliases].map(normalizeMatchText).filter(Boolean);
    const nameParts = normalizeMatchText(person.name).split(" ").filter((part) => part.length > 2);
    return parts.some((part) => part === value || part.includes(value) || value.includes(part)) || nameParts.some((part) => part === value);
  });
  if (companyNorm) {
    const byCompany = matches.filter((person) => normalizeMatchText(person.company).includes(companyNorm) || companyNorm.includes(normalizeMatchText(person.company)));
    if (byCompany.length) matches = byCompany;
  }
  if (matches.length === 1) return { status: "matched", person: matches[0], matches };
  if (matches.length > 1) return { status: "ambiguous", matches };
  return { status: "unmatched", matches: [] };
}

function employeeNamesFromSpeech(text = "") {
  const original = String(text || "");
  const stop = new Set(["heute", "waren", "war", "wir", "mit", "mitarbeiter", "mann", "leute", "personen", "baustelle", "vor", "ort", "da", "von", "firma", "bau", "drei", "vier", "zwei", "funf", "fuenf", "sechs", "sieben", "und", "auf", "der", "die", "das", "es", "wurde", "wurden"]);
  const segments = [];
  const named = original.match(/(?:mitarbeiter|personal)\s*:?\s*([^.;]+)/i);
  if (named) segments.push(named[1]);
  const were = original.match(/(?:waren|war)\s+([^.;:]+?)(?:\s+vor\s+ort|\s+da|\.|$)/i);
  if (were) segments.push(were[1]);
  const afterColon = original.match(/:\s*([^.;]+)/);
  if (afterColon) segments.push(afterColon[1]);
  const candidates = segments.join(", ").split(/,|\bund\b|\+|\/|;/i)
    .map((item) => item.trim().replace(/^(von|mit|und)\s+/i, "").replace(/\b(vor ort|da|auf der baustelle)\b/gi, "").trim())
    .filter((item) => item && item.length > 1)
    .filter((item) => !stop.has(normalizeMatchText(item)) && !/^\d+$/.test(item));
  const known = [];
  for (const person of dailyEmployeeCandidates()) {
    const nameNorm = normalizeMatchText(person.name);
    if (nameNorm && normalizeMatchText(original).includes(nameNorm)) known.push(person.name);
    for (const alias of person.aliases) if (alias && normalizeMatchText(original).includes(normalizeMatchText(alias))) known.push(alias);
  }
  return uniqueValues([...known, ...candidates]).filter((name) => normalizeMatchText(name).split(" ").some((part) => part.length > 2));
}

function extractDailyReportFieldsFromSpeech(text = "") {
  const normalized = normalizeMatchText(text);
  const result = { fields: {}, sources: {}, confidence: {}, warnings: [] };
  const time = normalized.match(/(?:von|ab)\s*(\d{1,2})(?::?(\d{2}))?\s*(?:bis|-)\s*(\d{1,2})(?::?(\d{2}))?/);
  if (time) {
    result.fields.workStart = `${time[1].padStart(2, "0")}:${(time[2] || "00").padStart(2, "0")}`;
    result.fields.workEnd = `${time[3].padStart(2, "0")}:${(time[4] || "00").padStart(2, "0")}`;
    result.sources.workStart = result.sources.workEnd = time[0];
    result.confidence.workStart = result.confidence.workEnd = "medium";
  }
  const weather = text.match(/(wetter[^.]+|trocken[^.]*|regen[^.]*|sonnig[^.]*|bew[öo]lkt[^.]*)/i);
  const temp = text.match(/(\d{1,2})\s*(grad|°c)/i);
  if (weather || temp) {
    result.fields.weather = [weather?.[0], temp?.[0]].filter(Boolean).join(", ");
    result.sources.weather = result.fields.weather;
    result.confidence.weather = "medium";
  }
  const trade = (normalizeMasterData(state.masterData).trades || []).find((item) => normalized.includes(normalizeMatchText(item)));
  if (trade) {
    result.fields.trade = trade;
    result.sources.trade = trade;
    result.confidence.trade = "medium";
  }
  const material = text.match(/(?:material|lieferung|geliefert)\s*:?\s*([^.;]+)/i);
  if (material) {
    result.fields.materials = material[1].trim();
    result.sources.materials = material[0];
    result.confidence.materials = "medium";
  }
  const equipment = text.match(/(?:gerät|geräte|maschine|maschinen)\s*:?\s*([^.;]+)/i);
  if (equipment) {
    result.fields.equipment = equipment[1].trim();
    result.sources.equipment = equipment[0];
    result.confidence.equipment = "medium";
  }
  const delay = text.match(/(?:behinderung|behindert|wartezeit|zufahrt blockiert)\s*:?\s*([^.;]+)/i);
  if (delay) {
    result.fields.delays = delay[0].trim();
    result.sources.delays = delay[0];
    result.confidence.delays = "medium";
  }
  const defect = text.match(/(?:mangel|mängel|offene punkte|problem)\s*:?\s*([^.;]+)/i);
  if (defect) {
    result.fields.defects = defect[0].trim();
    result.sources.defects = defect[0];
    result.confidence.defects = "medium";
  }
  result.fields.workOriginal = text.trim();
  result.fields.workGerman = text.trim();
  result.sources.workOriginal = text.trim();
  result.confidence.workOriginal = "medium";
  return result;
}

function extractDailyEmployeesFromSpeech(text = "") {
  const company = findCompanyInText(text);
  const count = germanNumberFromText(text);
  const names = employeeNamesFromSpeech(text);
  const workers = [];
  const unmatched = [];
  const sources = [];
  const selectedIds = [];
  for (const rawName of names) {
    const match = matchEmployeeName(rawName, company?.name || "");
    if (match.status === "matched") {
      selectedIds.push(match.person.id);
      sources.push({ name: rawName, employeeId: match.person.id, confidence: "high", status: "matched" });
      workers.push(normalizeDailyWorker({ name: match.person.name, company: match.person.company || company?.name || "", role: match.person.role || "", employeeId: match.person.id, source: "voice", confidence: "high", matchStatus: "matched", sourceName: rawName }, workers.length));
    } else if (match.status === "ambiguous") {
      unmatched.push(rawName);
      sources.push({ name: rawName, confidence: "low", status: "ambiguous", candidates: match.matches.map((item) => item.name) });
      workers.push(normalizeDailyWorker({ name: rawName, company: company?.name || "", source: "voice", confidence: "low", matchStatus: "ambiguous", sourceName: rawName, note: "Mehrere Stammdaten-Treffer – bitte auswählen." }, workers.length));
    } else {
      unmatched.push(rawName);
      sources.push({ name: rawName, confidence: "low", status: "unmatched" });
      workers.push(normalizeDailyWorker({ name: rawName, company: company?.name || "", source: "voice", confidence: "low", matchStatus: "unmatched", sourceName: rawName, note: "Mitarbeiter nicht in Stammdaten gefunden – bitte auswählen oder neu anlegen." }, workers.length));
    }
  }
  const targetCount = Math.max(Number(count) || 0, workers.length);
  while (workers.length < targetCount) workers.push(normalizeDailyWorker({ company: company?.name || "", source: "voice", confidence: "medium", matchStatus: "empty", note: "Per Sprache angelegt – bitte Mitarbeiter auswählen." }, workers.length));
  return { count: targetCount || "", spokenCount: count || "", company, workers, unmatched, selectedIds, sources, confidence: unmatched.length ? "medium" : (workers.length ? "high" : "") };
}

function applyDailyVoiceExtraction(text = "") {
  if (!isDailyReportProtocol()) return;
  saveDailyReportForm({ persistNow: false });
  const report = state.current.dailyReport = normalizeDailyReportMeta(state.current.dailyReport || {}, state.current);
  const raw = String(text || report.voiceDraft || report.raw_transcript || "").trim();
  if (!raw) return showAppToast("Bitte zuerst einen Bautagesbericht einsprechen oder Text einfügen.", { type: "info" });
  const fieldResult = extractDailyReportFieldsFromSpeech(raw);
  const employeeResult = extractDailyEmployeesFromSpeech(raw);
  report.voiceDraft = raw;
  report.raw_transcript = raw;
  report.cleaned_text_de = raw;
  report.original_language = report.inputLanguage || "de";
  report.ai_form_extraction_used = true;
  report.field_sources = { ...(report.field_sources || {}), ...fieldResult.sources };
  report.field_confidence = { ...(report.field_confidence || {}), ...fieldResult.confidence };
  Object.entries(fieldResult.fields).forEach(([key, value]) => {
    if (value && (!report[key] || ["workOriginal", "workGerman"].includes(key))) report[key] = key === "workOriginal" || key === "workGerman" ? appendVoiceText(report[key] || "", value) : value;
  });
  if (employeeResult.count) report.personCount = String(employeeResult.count);
  if (employeeResult.company?.name && !report.company) report.company = employeeResult.company.name;
  if (employeeResult.workers.length) report.workers = employeeResult.workers;
  report.mitarbeiter_count_spoken = employeeResult.spokenCount ? String(employeeResult.spokenCount) : "";
  report.selected_employee_ids = employeeResult.selectedIds;
  report.unmatched_employee_names = employeeResult.unmatched;
  report.employee_field_sources = employeeResult.sources;
  report.employee_confidence = employeeResult.confidence;
  report.ai_employee_extraction_used = !!employeeResult.workers.length;
  report.voice_warnings = employeeResult.unmatched.length ? ["Mitarbeiter nicht eindeutig in Stammdaten gefunden – bitte prüfen."] : [];
  state.current.updatedAt = new Date().toISOString();
  persist();
  renderDailyReportEditor();
  showAppToast("Diktat ausgewertet. Bitte Vorschau und Felder prüfen.", { type: "success" });
}

function renderDailyVoicePreview(report = state.current?.dailyReport || {}) {
  const target = $("#dailyVoicePreview");
  if (!target) return;
  const workers = normalizeDailyWorkers(report.workers || []);
  const matched = workers.filter((worker) => worker.matchStatus === "matched");
  const open = workers.filter((worker) => !worker.name || worker.matchStatus === "unmatched" || worker.matchStatus === "ambiguous" || worker.matchStatus === "empty");
  const warnings = report.voice_warnings || [];
  target.innerHTML = report.ai_employee_extraction_used || report.ai_form_extraction_used ? `
    <div class="voice-preview-card">
      <strong>Personal erkannt</strong>
      <p class="muted">Erkannt: ${escapeHtml(String(report.mitarbeiter_count_spoken || report.personCount || workers.length || 0))} Mitarbeiter vor Ort</p>
      <ul>${workers.map((worker, index) => `<li>${escapeHtml(worker.name || `Mitarbeiter ${index + 1} auswählen`)} ${worker.matchStatus === "matched" ? "✓" : "– bitte prüfen"}${worker.company ? ` · ${escapeHtml(worker.company)}` : ""}</li>`).join("")}</ul>
      ${warnings.length ? `<p class="field-warning">${escapeHtml(warnings.join(" "))}</p>` : ""}
      <p class="muted">Gefunden: ${matched.length} · offen: ${open.length}</p>
    </div>` : `<p class="muted">Noch kein Bautagesbericht-Diktat ausgewertet.</p>`;
}
function renderDailyReportEditor() {
  const protocol = state.current;
  if (!isDailyReportProtocol(protocol)) return;
  const form = $("#dailyReportForm");
  if (!form) return;
  const project = projectById(protocol.projectId);
  const report = protocol.dailyReport = normalizeDailyReportMeta(protocol.dailyReport, protocol);
  if (form.elements.dailyVoiceDraft) form.elements.dailyVoiceDraft.value = report.voiceDraft || report.raw_transcript || "";
  form.elements.dailyTitle.value = protocol.head.acceptanceTitle || "Bautagesbericht";
  form.elements.dailyDate.value = report.date || (protocol.head.createdAt || "").slice(0, 10);
  form.elements.dailyProject.value = project?.name || protocol.head.projectName || "";
  form.elements.dailyAddress.value = projectAddressText(project, { multiline: false }) || formatAddress(protocol.head.siteAddress || protocol.head.siteAddressText || "", { multiline: false });
  form.elements.dailyReportNumber.value = report.reportNumber || "";
  form.elements.dailyStatus.value = report.status || "Entwurf";
  form.elements.dailyStart.value = report.workStart || "";
  form.elements.dailyEnd.value = report.workEnd || "";
  form.elements.dailyBreak.value = report.breakHours || "";
  form.elements.dailyCrew.value = report.crew || "";
  form.elements.dailyCompany.value = report.company || "";
  form.elements.dailyPersonCount.value = report.personCount || "";
  form.elements.dailyForeman.value = report.foreman || "";
  form.elements.dailyArea.value = report.area || "";
  form.elements.dailyTrade.value = report.trade || "";
  form.elements.dailyInputLanguage.value = report.inputLanguage || report.original_language || "de";
  form.elements.dailyTranslationStatus.value = report.translationStatus || "nicht übersetzt";
  form.elements.dailyWorkOriginal.value = report.original_text || report.workOriginal || "";
  form.elements.dailyWorkGerman.value = report.translated_text_de || report.workGerman || report.cleaned_text_de || "";
  form.elements.dailyWorkAlbanian.value = report.workAlbanian || "";
  form.elements.dailyWorkDescription.value = report.workDescription || "";
  if (form.elements.dailyTranslationChecked) form.elements.dailyTranslationChecked.checked = !!report.translation_checked;
  const translationHint = $("#dailyTranslationHint");
  if (translationHint) translationHint.textContent = report.translation_warning || (report.translation_provider ? `Übersetzung: ${report.translation_provider} · bitte prüfen.` : "KI-Übersetzung bitte prüfen. Ohne konfigurierten Dienst kann die deutsche Fassung manuell eingetragen werden.");
  form.elements.dailyMaterials.value = report.materials || "";
  form.elements.dailyEquipment.value = report.equipment || "";
  form.elements.dailyIncidentsOriginal.value = report.incidentsOriginal || "";
  form.elements.dailyIncidentsGerman.value = report.incidentsGerman || "";
  form.elements.dailyIncidentsAlbanian.value = report.incidentsAlbanian || "";
  form.elements.dailyDelays.value = report.delays || "";
  form.elements.dailyDefects.value = report.defects || "";
  form.elements.dailyWeather.value = report.weather || "";
  form.elements.dailyConfirmedBy.value = report.confirmedBy || "";
  form.elements.dailyTotal.value = dailyReportTotalHours(report);
  const banner = $("#dailyReportModeBanner");
  if (banner) banner.innerHTML = `<strong>Bautagesbericht</strong><span>${escapeHtml(project?.name || protocol.head.projectName || "Projekt")} · ${escapeHtml(formatDate(report.date || protocol.head.createdAt))}</span>`;
  renderDailyVoicePreview(report);
  renderDailyWorkers();
  renderDailyReportPhotos();
}

function saveDailyReportForm({ persistNow = true } = {}) {
  if (!isDailyReportProtocol()) return;
  const form = $("#dailyReportForm");
  if (!form) return;
  const p = state.current;
  const photos = p.dailyReport?.photos || [];
  const workers = normalizeDailyWorkers(p.dailyReport?.workers || []);
  const date = form.elements.dailyDate.value || (p.head.createdAt || nowLocalInput()).slice(0, 10);
  p.head.acceptanceTitle = form.elements.dailyTitle.value || `Bautagesbericht ${date}`;
  p.head.acceptanceType = "Bautagesbericht";
  p.head.createdAt = date ? `${date}T${(p.head.createdAt || "T08:00").slice(11, 16) || "08:00"}` : (p.head.createdAt || nowLocalInput());
  p.dailyReport = normalizeDailyReportMeta({
    reportNumber: form.elements.dailyReportNumber.value || "", status: form.elements.dailyStatus.value || "Entwurf", date,
    workStart: form.elements.dailyStart.value || "", workEnd: form.elements.dailyEnd.value || "", breakHours: form.elements.dailyBreak.value || "",
    crew: form.elements.dailyCrew.value || "", company: form.elements.dailyCompany.value || "", personCount: form.elements.dailyPersonCount.value || "", foreman: form.elements.dailyForeman.value || "",
    area: form.elements.dailyArea.value || "", trade: form.elements.dailyTrade.value || "", inputLanguage: form.elements.dailyInputLanguage.value || "de", translationStatus: form.elements.dailyTranslationStatus.value || "nicht übersetzt", workOriginal: form.elements.dailyWorkOriginal.value || "", workGerman: form.elements.dailyWorkGerman.value || "", workAlbanian: form.elements.dailyWorkAlbanian.value || "", workDescription: form.elements.dailyWorkDescription.value || "",
    materials: form.elements.dailyMaterials.value || "", equipment: form.elements.dailyEquipment.value || "", incidentsOriginal: form.elements.dailyIncidentsOriginal.value || "", incidentsGerman: form.elements.dailyIncidentsGerman.value || "", incidentsAlbanian: form.elements.dailyIncidentsAlbanian.value || "", delays: form.elements.dailyDelays.value || "", defects: form.elements.dailyDefects.value || "",
    weather: form.elements.dailyWeather.value || "", confirmedBy: form.elements.dailyConfirmedBy.value || "",
    voiceDraft: form.elements.dailyVoiceDraft?.value || p.dailyReport?.voiceDraft || "",
    raw_transcript: form.elements.dailyVoiceDraft?.value || p.dailyReport?.raw_transcript || "",
    source_audio_ids: p.dailyReport?.source_audio_ids || [], cleaned_text_de: form.elements.dailyWorkGerman.value || p.dailyReport?.cleaned_text_de || "", original_language: form.elements.dailyInputLanguage.value || p.dailyReport?.original_language || "de", original_text: form.elements.dailyWorkOriginal.value || p.dailyReport?.original_text || "", translated_text_de: form.elements.dailyWorkGerman.value || p.dailyReport?.translated_text_de || "", translation_used: !!(p.dailyReport?.translation_used || form.elements.dailyWorkDescription.value), translation_checked: !!form.elements.dailyTranslationChecked?.checked, translation_created_at: p.dailyReport?.translation_created_at || "", translation_provider: p.dailyReport?.translation_provider || "", translation_warning: p.dailyReport?.translation_warning || "", field_sources: p.dailyReport?.field_sources || {}, field_confidence: p.dailyReport?.field_confidence || {}, ai_form_extraction_used: !!p.dailyReport?.ai_form_extraction_used, user_confirmed: !!p.dailyReport?.user_confirmed, signed_at: p.dailyReport?.signed_at || "", report_status: p.dailyReport?.report_status || "draft", mitarbeiter_count_spoken: p.dailyReport?.mitarbeiter_count_spoken || "", selected_employee_ids: p.dailyReport?.selected_employee_ids || [], unmatched_employee_names: p.dailyReport?.unmatched_employee_names || [], employee_field_sources: p.dailyReport?.employee_field_sources || [], employee_confidence: p.dailyReport?.employee_confidence || "", ai_employee_extraction_used: !!p.dailyReport?.ai_employee_extraction_used, voice_warnings: p.dailyReport?.voice_warnings || [],
    workers, photos
  }, p);
  p.dailyReport.totalHours = dailyReportTotalHours(p.dailyReport);
  form.elements.dailyTotal.value = p.dailyReport.totalHours;
  const project = projectById(p.projectId);
  if (project) syncProtocolProjectFields(p, project, { overwriteProtocol: false });
  p.weather.weatherCondition = p.dailyReport.weather;
  p.result.finalNote = p.dailyReport.translated_text_de || p.dailyReport.workGerman || p.dailyReport.workDescription || p.dailyReport.workOriginal || "";
  p.updatedAt = new Date().toISOString();
  if (persistNow) persist(); else schedulePersist();
}


function renderDailyWorkers() {
  const target = $("#dailyWorkerList");
  if (!target || !isDailyReportProtocol()) return;
  const workers = normalizeDailyWorkers(state.current.dailyReport?.workers || []);
  state.current.dailyReport.workers = workers;
  target.innerHTML = workers.length ? workers.map((worker) => `
    <article class="daily-worker-card" data-daily-worker="${escapeAttr(worker.id)}">
      <div class="grid compact-grid">
        <label>Name<input data-daily-worker-field="name" list="personOptions" value="${escapeAttr(worker.name)}"></label>
        <label>Firma<input data-daily-worker-field="company" list="companyOptions" value="${escapeAttr(worker.company)}"></label>
        <label>Rolle / Tätigkeit<input data-daily-worker-field="role" list="tradeOptions" value="${escapeAttr(worker.role)}"></label>
        <label>Arbeitsbeginn<input data-daily-worker-field="start" type="time" step="60" value="${escapeAttr(worker.start)}"></label>
        <label>Arbeitsende<input data-daily-worker-field="end" type="time" step="60" value="${escapeAttr(worker.end)}"></label>
        <label>Pause (h)<input data-daily-worker-field="breakHours" type="number" min="0" step="0.25" value="${escapeAttr(worker.breakHours)}"></label>
        <label>Stunden<input data-daily-worker-field="hours" value="${escapeAttr(workerHours(worker))}" readonly></label>
      </div>
      ${worker.matchStatus && worker.matchStatus !== "matched" ? `<p class="field-warning">${escapeHtml(worker.note || "Bitte Mitarbeiter prüfen oder auswählen.")}</p>` : ""}
      <label>Bemerkung<textarea data-daily-worker-field="note" rows="2">${escapeHtml(worker.note)}</textarea></label>
      <div class="card-actions compact-actions"><button class="danger-btn" type="button" data-delete-daily-worker="${escapeAttr(worker.id)}">Mitarbeiter entfernen</button></div>
    </article>
  `).join("") : `<div class="empty-card muted">Noch keine einzelnen Mitarbeiter erfasst.</div>`;
}

function addDailyWorker() {
  if (!isDailyReportProtocol()) return;
  saveDailyReportForm({ persistNow: false });
  state.current.dailyReport.workers = normalizeDailyWorkers(state.current.dailyReport.workers || []);
  const defaultStart = normalizeTimeValue(state.current.dailyReport.workStart || "07:00") || "07:00";
  const defaultEnd = normalizeTimeValue(state.current.dailyReport.workEnd || "") || "";
  state.current.dailyReport.workers.push(normalizeDailyWorker({ start: defaultStart, end: defaultEnd, breakHours: state.current.dailyReport.breakHours || "" }, state.current.dailyReport.workers.length));
  persist();
  renderDailyReportEditor();
}

function deleteDailyWorker(workerId) {
  if (!isDailyReportProtocol()) return;
  state.current.dailyReport.workers = (state.current.dailyReport.workers || []).filter((worker) => worker.id !== workerId);
  persist();
  renderDailyReportEditor();
}

function updateDailyWorkerField(input) {
  const worker = dailyWorkerById(input.closest("[data-daily-worker]")?.dataset.dailyWorker || "");
  if (!worker) return;
  const field = input.dataset.dailyWorkerField;
  if (["start", "end"].includes(field)) worker[field] = normalizeTimeValue(input.value || "");
  else worker[field] = input.value || "";
  if (field === "name") {
    const match = matchEmployeeName(worker.name, worker.company);
    if (match.status === "matched") {
      worker.employeeId = match.person.id;
      worker.name = match.person.name;
      worker.company = worker.company || match.person.company || "";
      worker.role = worker.role || match.person.role || "";
      worker.matchStatus = "matched";
      worker.confidence = "high";
    }
  }
  worker.hours = workerHours(worker);
  state.current.updatedAt = new Date().toISOString();
  const card = input.closest("[data-daily-worker]");
  const hoursInput = card?.querySelector('[data-daily-worker-field="hours"]');
  if (hoursInput) hoursInput.value = worker.hours || "";
  schedulePersist();
}

function renderDailyReportPhotos() {
  const target = $("#dailyPhotoList");
  if (!target || !isDailyReportProtocol()) return;
  const photos = state.current.dailyReport?.photos || [];
  target.innerHTML = photos.length ? photos.map((photo) => `<figure class="photo-tool-card"><img data-photo-thumb="${photo.id}" alt="${escapeAttr(photo.name || "Foto")}"><figcaption><span>${escapeHtml(photo.name || "Foto")}</span><input data-daily-photo-caption="${photo.id}" value="${escapeAttr(photo.caption || "")}" placeholder="Bildbeschreibung">${photoBackupActions(photo)}<button class="small-btn" type="button" data-delete-daily-photo="${photo.id}">Foto löschen</button></figcaption></figure>`).join("") : `<div class="empty-card muted">Noch keine Fotos im Bautagesbericht.</div>`;
  hydratePhotoThumbs(target);
}

function updateDailyPhotoCaption(element) {
  const photo = (state.current?.dailyReport?.photos || []).find((item) => item.id === element.dataset.dailyPhotoCaption);
  if (!photo) return;
  photo.caption = element.value || "";
  state.current.updatedAt = new Date().toISOString();
  schedulePersist();
}

function triggerDailyPhotoPicker(source) {
  if (!isDailyReportProtocol()) return;
  state.photoTarget = { kind: "dailyReport", id: state.current.id, source };
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  if (source === "camera") input.setAttribute("capture", "environment");
  if (source === "gallery") input.multiple = true;
  input.className = "visually-hidden";
  input.addEventListener("change", async () => { await addPhotos(Array.from(input.files || [])); input.remove(); }, { once: true });
  document.body.appendChild(input);
  input.click();
}

function deleteDailyPhotoRef(photoId) {
  if (!isDailyReportProtocol()) return;
  state.current.dailyReport.photos = (state.current.dailyReport.photos || []).filter((photo) => photo.id !== photoId);
  idbDelete("photos", photoId);
  persist();
  renderDailyReportEditor();
}

function deleteDailyReportProtocol(protocolId) {
  state.protocols = state.protocols.filter((protocol) => protocol.id !== protocolId);
  persist();
  renderDailyReportView();
  if ($("#projectHubView")?.classList.contains("active")) renderProjectHub();
  showAppToast("Bautagesbericht gelöscht.");
}

async function fillDailyReportWeatherFromLocation() {
  if (!isDailyReportProtocol()) return;
  const form = $("#dailyReportForm");
  if (!form) return;
  if (!navigator.geolocation) { showAppToast("GPS ist in diesem Browser nicht verfügbar.", { type: "error" }); return; }
  showAppToast("Wetter wird geladen ...", { type: "info", timeout: 1800 });
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const { latitude, longitude } = pos.coords;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`;
      const response = await fetch(url);
      const data = await response.json();
      const current = data.current || {};
      form.elements.dailyWeather.value = `${current.temperature_2m ?? "?"} °C, Luftfeuchte ${current.relative_humidity_2m ?? "?"} %, Niederschlag ${current.precipitation ?? 0} mm, Wind ${current.wind_speed_10m ?? "?"} km/h`;
      saveDailyReportForm();
      showAppToast("Wetterdaten eingefügt.");
    } catch { showAppToast("Wetterdaten konnten nicht geladen werden.", { type: "error" }); }
  }, () => showAppToast("Standort konnte nicht ermittelt werden.", { type: "error" }), { enableHighAccuracy: false, timeout: 10000 });
}



function detectDailyInputLanguage(text = "") {
  const value = String(text || "").toLowerCase();
  const albanianHints = ["sot", "kemi", "punuar", "nesër", "neser", "janë", "jane", "vendosur", "kontrolluar", "pllak", "betonit", "armatura", "distancat"];
  const germanHints = ["heute", "morgen", "bodenplatte", "bewehrung", "betonage", "fertig", "vorbereitet"];
  const sq = albanianHints.some((word) => value.includes(word));
  const de = germanHints.some((word) => value.includes(word));
  if (sq && de) return "mixed";
  if (sq) return "sq";
  if (de) return "de";
  return "auto";
}

function localDailyGermanTranslation(text = "", sourceLang = "auto") {
  const raw = cleanDictationText(text);
  if (!raw) return "";
  const lower = raw.toLowerCase();
  if (sourceLang === "de" || (!/(sot|kemi|punuar|nes[eë]r|jan[ëe]|armatura|pllak)/i.test(raw) && /[a-zäöüß]/i.test(raw))) {
    return polishDictationText(raw);
  }
  if (lower.includes("sot") && lower.includes("pllak") && lower.includes("armatur") && lower.includes("distanc")) {
    return "Heute haben wir an der Bodenplatte gearbeitet. Die Bewehrung wurde eingebaut und die Abstände wurden kontrolliert.";
  }
  if (lower.includes("heute") && lower.includes("bodenplatte") && lower.includes("armatura") && (lower.includes("nesër") || lower.includes("neser"))) {
    return "Heute wurde die Bodenplatte vorbereitet, die untere Bewehrung ist fertig. Morgen ist die Betonage vorgesehen.";
  }
  let value = raw
    .replace(/\bSot\b/gi, "Heute")
    .replace(/\bkemi punuar\b/gi, "haben wir gearbeitet")
    .replace(/\bnes[ëe]r\b/gi, "morgen")
    .replace(/\bbetonage\b/gi, "Betonage")
    .replace(/\barmatura\b/gi, "Bewehrung")
    .replace(/\bpllak[ëe]n? e betonit\b/gi, "Bodenplatte")
    .replace(/\bdistancat\b/gi, "Abstände");
  value = polishDictationText(value);
  return /[a-zäöüß]/i.test(value) ? value : "[unklar]";
}

function dailyGermanDocumentationText(report = {}) {
  return report.translated_text_de || report.workGerman || report.cleaned_text_de || (report.original_language === "de" || report.inputLanguage === "de" ? polishDictationText(report.original_text || report.workOriginal || "") : "") || report.workDescription || "";
}

async function translateText({ text, sourceLang, targetLang }) {
  const cleanText = (text || "").trim();
  if (!cleanText) throw new Error("Kein Text für die Übersetzung vorhanden.");
  const endpointUrl = (state.settings.translationEndpointUrl || "").trim();
  if (!state.settings.translationEnabled || !endpointUrl) {
    return { translatedText: "", skipped: true };
  }
  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: cleanText, sourceLang, targetLang, context: "construction_daily_report" })
  });
  if (!response.ok) throw new Error(`Übersetzungsdienst HTTP ${response.status}`);
  const data = await response.json();
  return { translatedText: data.translatedText || "", skipped: false };
}

function dailyTranslationSourceText(direction, report = state.current?.dailyReport || {}) {
  if (direction === "sq-de") return report.inputLanguage === "sq" ? report.workOriginal : (report.workAlbanian || report.workOriginal);
  if (direction === "de-sq") return report.inputLanguage === "de" ? report.workOriginal : (report.workGerman || report.workOriginal);
  return report.workOriginal || "";
}

async function runDailyTranslation(direction = "auto") {
  if (!isDailyReportProtocol()) return;
  saveDailyReportForm({ persistNow: false });
  const report = state.current.dailyReport = normalizeDailyReportMeta(state.current.dailyReport || {}, state.current);
  const original = cleanDictationText(report.original_text || report.workOriginal || report.voiceDraft || report.raw_transcript || "");
  if (!original) return showAppToast("Bitte zuerst Originaltext eintragen oder diktieren.", { type: "info" });
  let language = report.original_language || report.inputLanguage || "auto";
  if (language === "auto") language = detectDailyInputLanguage(original);
  report.original_language = language;
  report.inputLanguage = language;
  report.original_text = original;
  report.workOriginal = original;
  report.translation_warning = "KI-Übersetzung bitte prüfen.";
  try {
    let german = "";
    let provider = "lokal";
    if (language === "de") {
      german = polishDictationText(original);
      provider = "lokale Textglättung";
    } else {
      const result = await translateText({ text: original, sourceLang: language === "mixed" ? "auto" : language, targetLang: "de" });
      if (!result.skipped && result.translatedText) {
        german = polishDictationText(result.translatedText);
        provider = "konfigurierter Übersetzungsdienst";
      } else {
        german = localDailyGermanTranslation(original, language);
        provider = german && german !== polishDictationText(original) ? "lokales MVP-Glossar" : "manuell erforderlich";
        report.translation_warning = provider === "manuell erforderlich"
          ? "Automatische Übersetzung ist nicht konfiguriert. Bitte deutsche Fassung manuell prüfen/eintragen."
          : "Lokale MVP-Übersetzung bitte besonders prüfen.";
      }
    }
    report.translated_text_de = german;
    report.workGerman = german;
    report.cleaned_text_de = german;
    report.translation_used = true;
    report.translation_checked = false;
    report.translation_created_at = new Date().toISOString();
    report.translation_provider = provider;
    report.translationStatus = provider === "manuell erforderlich" ? "manuell prüfen" : "deutsche Fassung erstellt";
    showAppToast(provider === "manuell erforderlich" ? "Automatische Übersetzung ist nicht konfiguriert. Deutsche Fassung bitte manuell eintragen." : "Deutsche Fassung erstellt. Bitte prüfen.", { type: provider === "manuell erforderlich" ? "info" : "success", timeout: 5500 });
  } catch (error) {
    report.translationStatus = "Fehler";
    report.translation_warning = "Übersetzung fehlgeschlagen. Bitte deutsche Fassung manuell eintragen.";
    showAppToast(`Übersetzung fehlgeschlagen: ${error?.message || error}`, { type: "error", timeout: 6500 });
  }
  persist();
  renderDailyReportEditor();
}

function applyDailyGermanTranslation() {
  if (!isDailyReportProtocol()) return;
  saveDailyReportForm({ persistNow: false });
  const report = state.current.dailyReport = normalizeDailyReportMeta(state.current.dailyReport || {}, state.current);
  const german = polishDictationText(report.translated_text_de || report.workGerman || "");
  if (!german) return showAppToast("Bitte zuerst eine deutsche Fassung erzeugen oder eintragen.", { type: "info" });
  report.translated_text_de = german;
  report.workGerman = german;
  report.cleaned_text_de = german;
  report.workDescription = german;
  report.translation_used = true;
  report.translation_checked = true;
  report.translationStatus = "geprüft / übernommen";
  report.translation_warning = "Deutsche Fassung wurde für den Bautagesbericht übernommen.";
  state.current.updatedAt = new Date().toISOString();
  persist();
  renderDailyReportEditor();
  showAppToast("Deutsche Fassung übernommen.", { type: "success" });
}

function dailyTranslationPrompt(direction = "auto") {
  const report = state.current?.dailyReport || {};
  const text = report.original_text || report.workOriginal || report.voiceDraft || report.raw_transcript || "";
  return `Übersetze den folgenden Baustellenberichtstext ins Deutsche. Korrigiere nur offensichtliche Sprach- und Satzfehler. Ändere keine fachliche Aussage. Ergänze keine Inhalte. Erfinde keine Mengen, Zeiten, Personen, Firmen, Ursachen oder Bewertungen. Wenn etwas unklar ist, markiere es als [unklar].\n\nGlossar beachten: Bodenplatte, Bewehrung, Mattenlage, obere Lage, untere Lage, Schalung, Sauberkeitsschicht, Fundamenterder, Einbauteile, Betonage, Verbau, LTH Bau GmbH, Labi, UG, EG, OG, DG.\n\nOriginaltext:\n${text}`;
}

async function copyDailyTranslationPrompt(direction = "auto") {
  if (!isDailyReportProtocol()) return;
  saveDailyReportForm({ persistNow: false });
  const prompt = dailyTranslationPrompt(direction);
  try {
    await navigator.clipboard.writeText(prompt);
    showAppToast("Übersetzungstext kopiert.");
  } catch {
    showAppToast("Zwischenablage nicht verfügbar. Bitte Originaltext manuell kopieren.", { type: "error" });
  }
}

async function buildDailyReportParts() {
  saveDailyReportForm({ persistNow: false });
  const p = state.current;
  const report = p.dailyReport = normalizeDailyReportMeta(p.dailyReport || {}, p);
  const project = projectById(p.projectId);
  const photoCards = [];
  for (const photo of report.photos || []) {
    const url = await reportPhotoDataUrl(photo.id, { maxWidth: 1400, maxHeight: 1400, type: "image/jpeg", quality: 0.75 });
    if (url) photoCards.push({ photo, url });
  }
  const css = `body{margin:0;background:#e9eef3;color:#172033;font-family:Arial,Helvetica,sans-serif}.report-export{background:#e9eef3;padding:18px}.report-page{width:180mm;max-width:180mm;min-height:267mm;margin:0 auto;background:#fff;padding:14mm;box-shadow:0 12px 34px rgba(15,23,42,.16);box-sizing:border-box}.report-header{display:flex;justify-content:space-between;gap:18px;border-bottom:2px solid #1f2d3d;padding-bottom:12px;margin-bottom:14px}.brand{text-transform:uppercase;letter-spacing:.06em;color:#667085;font-size:10px;font-weight:700}.report-header h1{margin:4px 0 6px;font-size:24px}.muted{color:#667085}.doc-meta{display:grid;gap:8px;min-width:36mm}.doc-meta div{border:1px solid #d8dee6;border-radius:8px;padding:7px 9px}.doc-meta span{display:block;font-size:9px;color:#667085;text-transform:uppercase}.doc-meta strong{font-size:12px}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.info-card,.daily-card{border:1px solid #d8dee6;border-radius:10px;background:#fbfcfe;padding:10px 12px;margin:10px 0;break-inside:avoid}.info-card h3,.daily-card h3{margin:0 0 8px;font-size:14px}.info-row{display:grid;grid-template-columns:35mm 1fr;gap:8px;border-top:1px solid #edf1f5;padding:6px 0;font-size:11px}.info-row:first-of-type{border-top:0}.text-block{white-space:pre-wrap;font-size:11.5px;line-height:1.45;margin:6px 0}.worker-table{width:100%;border-collapse:collapse;font-size:10.5px}.worker-table th,.worker-table td{border:1px solid #d8dee6;padding:5px 6px;text-align:left;vertical-align:top}.worker-table th{background:#f3f6f9;color:#4b5563}.photo-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.photo{break-inside:avoid}.photo img{width:100%;height:165px;object-fit:cover;border:1px solid #cfd6dd;background:#fff}.photo p{font-size:10.5px;color:#667085;margin:5px 0 0}.footer-note{margin-top:24px;border-top:1px solid #d8dee6;padding-top:8px;color:#667085;font-size:10.5px;display:flex;justify-content:space-between;gap:12px}@media print{.print-btn,.save-hint{display:none}.report-export,.report-page{width:180mm;max-width:180mm;margin:0}.daily-card,.photo{break-inside:avoid;page-break-inside:avoid}}`;
  const photoHtml = photoCards.length ? `<div class="photo-grid">${photoCards.map(({ photo, url }) => `<figure class="photo"><img src="${url}" alt="${escapeAttr(photo.name || "Foto")}"><figcaption><p><strong>${escapeHtml(photo.caption || photo.name || "Foto")}</strong></p><p>${escapeHtml(photo.name || "Foto")}</p></figcaption></figure>`).join("")}</div>` : `<p class="muted">Keine Fotos dokumentiert.</p>`;
  const workers = normalizeDailyWorkers(report.workers || []);
  const germanWorkText = dailyGermanDocumentationText(report);
  const originalWorkText = report.original_text || report.workOriginal || "";
  const showOriginalText = originalWorkText && (report.original_language || report.inputLanguage) !== "de";
  const originalLanguageLabel = report.original_language === "sq" ? "Albanisch" : report.original_language === "mixed" ? "Deutsch/Albanisch gemischt" : report.original_language === "auto" ? "automatisch" : "Deutsch";
  const workerHtml = workers.length ? `<table class="worker-table"><thead><tr><th>Name</th><th>Firma</th><th>Rolle</th><th>von</th><th>bis</th><th>Pause</th><th>Stunden</th><th>Bemerkung</th></tr></thead><tbody>${workers.map((worker) => `<tr><td>${escapeHtml(worker.name || "-")}</td><td>${escapeHtml(worker.company || "")}</td><td>${escapeHtml(worker.role || "")}</td><td>${escapeHtml(worker.start || "")}</td><td>${escapeHtml(worker.end || "")}</td><td>${escapeHtml(worker.breakHours || "")}</td><td>${escapeHtml(workerHours(worker) || worker.hours || "")}</td><td>${escapeHtml(worker.note || "")}</td></tr>`).join("")}</tbody></table>` : `<p class="muted">Keine einzelnen Mitarbeiter erfasst.</p>`;
  const projectRows = [["Projekt", project?.name || p.head.projectName], ["Adresse", projectAddressText(project, { multiline: false }) || formatAddress(p.head.siteAddress || p.head.siteAddressText || "") || "ohne Angabe"], ["Datum", formatDate(report.date || p.head.createdAt)], ["Bericht-Nr.", report.reportNumber], ["Status", report.status]];
  const workRows = [["Arbeitszeit", [report.workStart, report.workEnd].filter(Boolean).join(" - ")], ["Pause", report.breakHours ? `${report.breakHours} h` : ""], ["Gesamtstunden", report.totalHours || dailyReportTotalHours(report)], ["Mitarbeiter / Kolonne", report.crew], ["Firma", report.company], ["Anzahl Personen", report.personCount], ["Vorarbeiter", report.foreman]];
  const body = `<div class="report-export"><main class="report-page"><header class="report-header"><div><div class="brand">Kai BauSuite · Bautagesbericht</div><h1>Bautagesbericht</h1><p class="muted">Tagesdokumentation mit Arbeitszeiten, Tätigkeiten, Wetter, Fotos und Bestätigung.</p></div><aside class="doc-meta"><div><span>Datum</span><strong>${escapeHtml(formatDate(report.date || p.head.createdAt))}</strong></div><div><span>Status</span><strong>${escapeHtml(report.status || "Entwurf")}</strong></div></aside></header><section class="info-grid"><div class="info-card"><h3>Projekt</h3>${projectRows.map(([k,v]) => infoRow(k,v)).join("")}</div><div class="info-card"><h3>Arbeitszeit / Personal</h3>${workRows.map(([k,v]) => infoRow(k,v)).join("")}</div></section><section class="daily-card"><h3>Wetter / Bedingungen</h3><p class="text-block">${escapeHtml(report.weather || "Keine Wetterdaten erfasst.")}</p></section><section class="daily-card"><h3>Anwesende Mitarbeiter</h3>${workerHtml}</section><section class="daily-card"><h3>Tätigkeiten</h3>${infoRow("Bereich / Ort", report.area)}${infoRow("Gewerk", report.trade)}${infoRow("Originalsprache", originalLanguageLabel)}${infoRow("Übersetzungsstatus", report.translationStatus || "nicht übersetzt")}<p class="text-block">${escapeHtml(germanWorkText || "Keine Tätigkeiten dokumentiert.")}</p>${report.translation_provider ? `<p class="muted">Deutsche Fassung: ${escapeHtml(report.translation_provider)} · bitte geprüft verwenden.</p>` : ""}${showOriginalText ? `<div class="info-card"><h3>Originaltext</h3><p class="text-block">${escapeHtml(originalWorkText)}</p></div>` : ""}</section><section class="daily-card"><h3>Baustellendokumentation</h3>${infoRow("Materiallieferungen", report.materials)}${infoRow("Geräte / Maschinen", report.equipment)}${infoRow("Besondere Vorkommnisse", report.incidentsOriginal)}${infoRow("Behinderungen", report.delays)}${infoRow("Mängel / Hinweise", report.defects)}</section><section class="daily-card"><h3>Fotos</h3>${photoHtml}</section><section class="daily-card result-box"><h3>Bestätigung</h3>${infoRow("Bestätigt von", report.confirmedBy)}<p class="muted">Digitale Unterschriften können später für Bautagesberichte ergänzt werden.</p></section><footer class="footer-note"><span>${escapeHtml(project?.name || p.head.projectName || "Kai BauSuite")}</span><span>${escapeHtml(formatDate(report.date || p.head.createdAt))}</span><span>Kai BauSuite</span></footer></main></div>`;
  const title = sanitizeFileName(`Bautagesbericht_${project?.name || p.head.projectName || "Projekt"}_${report.date || (p.head.createdAt || "").slice(0,10)}`);
  return { css, body, title, fileName: `${title}.pdf` };
}


function protocolDateMinuteKey(value = "") {
  if (!value) return "";
  const text = String(value);
  const match = text.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
  return match ? `${match[1]}T${match[2]}` : text.slice(0, 16);
}

function protocolSignatureDateTime(protocol = state.current) {
  return (protocol?.signatures || [])
    .map((signature) => signature?.signedAt || "")
    .filter(Boolean)
    .sort()
    .at(-1) || "";
}

function protocolInspectionDateTime(protocol = state.current) {
  const inspection = protocol?.head?.inspectionDateTime || protocol?.head?.reportDateTime || "";
  const weather = protocol?.weather?.weatherDateTime || "";
  const signature = protocolSignatureDateTime(protocol);
  const created = protocol?.head?.createdAt || protocol?.createdAt || "";
  const inspectionLooksTechnical = inspection && created && protocolDateMinuteKey(inspection) === protocolDateMinuteKey(created);
  if (inspection && !inspectionLooksTechnical) return inspection;
  if (weather) return weather;
  if (signature) return signature;
  if (inspection) return inspection;
  return nowLocalInput();
}

async function buildReportParts() {
  if (isDailyReportProtocol()) return buildDailyReportParts();
  if (isSiteControlProtocol()) return buildSiteControlReportParts();
  saveFromForm();
  await ensureReportPlanImages();
  const p = state.current;
  const project = projectById(p.projectId);
  const clientCompany = projectClientRecord(project);
  const contractorCompany = projectContractorRecord(project, p);
  const projectInspector = projectInspectorRecord(project);
  const defaultInspectorPerson = projectDefaultInspectorRecord(project, p);
  p.checkpoints.forEach(updateCheckStatus);
  const reportPlans = reportPlansForProtocol(p);
  const issues = sampleIssues(p);
  const overviewPhotosHtml = await overviewPhotoReport(p);
  const planAppendixHtml = await planAppendixReport(p);
  const unplacedFindingsHtml = await unplacedFindingsReport(p);
  const followup = isFollowupProtocol(p);
  const reportTitle = followup ? "Nachbegehung / Nachkontrolle" : "Bewehrungskontrolle / Bewehrungsabnahme";
  const reportSubtitle = followup
    ? "Kurzer Nachbegehungsbericht zu den aus der Erstabnahme übernommenen offenen Punkten, Auflagen und Mängeln."
    : "Örtliche, stichprobenartige Kontrolle der Bewehrung auf Grundlage der vorliegenden Ausführungs- und Bewehrungspläne. Die Betonagefreigabe erfolgt unter Berücksichtigung der dokumentierten Feststellungen und Auflagen.";
  const css = `
    @page{size:A4;margin:18mm 15mm 20mm}
    *{box-sizing:border-box}
    html,body{width:100%;min-height:100%;overflow-x:hidden}
    body{font-family:Arial,Helvetica,sans-serif;color:#1f2933;margin:0;line-height:1.45;background:#fff;font-size:12px}
    .print-btn{position:fixed;right:18px;top:18px;z-index:20;background:#1f4e79;color:#fff;border:0;border-radius:4px;padding:10px 14px;font-weight:700}
    .save-hint{position:sticky;top:0;z-index:19;background:#fff7d6;border-bottom:1px solid #e6c65c;color:#4f3b00;padding:12px 18px;font-size:13px;font-weight:700}
    .report-export{width:190mm;max-width:190mm;margin:0 auto;padding:0;background:#fff;color:#111;box-sizing:border-box;overflow:visible;transform:none;zoom:1}
    .report-page{width:190mm;max-width:190mm;margin:0 auto;padding:0;background:#fff;overflow:visible;transform:none;zoom:1}
    .report-header{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:start;border-bottom:3px solid #1f4e79;padding-bottom:18px;margin-bottom:22px}
    .brand{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#5b6773;font-weight:700}
    h1{font-size:28px;line-height:1.15;margin:6px 0 8px;color:#17212b}
    .subtitle{margin:0;color:#52606d;font-size:13px;max-width:720px}
    .doc-meta{min-width:185px;border:1px solid #d8dee6;border-radius:6px;padding:10px 12px;background:#f7f9fb}
    .doc-meta div{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #e4e8ee;padding:4px 0}.doc-meta div:last-child{border-bottom:0}
    h2{font-size:17px;color:#17212b;margin:26px 0 12px;padding-bottom:7px;border-bottom:1.5px solid #aab4bf;break-after:avoid}
    h3{font-size:14px;margin:0 0 8px;color:#17212b}
    p{margin:6px 0 10px}.muted{color:#697586}.small{font-size:10.5px;color:#697586}
    table{width:100%;max-width:100%;border-collapse:collapse;margin:8px 0 14px;break-inside:avoid;page-break-inside:avoid;table-layout:fixed}
    th{background:#edf2f7;color:#26323f;font-size:11px;text-transform:uppercase;letter-spacing:.03em}
    td,th{border:1px solid #d8dee6;padding:8px 9px;text-align:left;vertical-align:top;overflow-wrap:anywhere;word-break:break-word}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0 20px}
    .info-card{border:1px solid #d8dee6;border-radius:6px;background:#fff;overflow:hidden;break-inside:avoid}
    .info-card h3{background:#f3f6f9;margin:0;padding:9px 11px;border-bottom:1px solid #d8dee6;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#4b5563}
    .info-row{display:grid;grid-template-columns:145px 1fr;gap:10px;padding:8px 11px;border-bottom:1px solid #edf0f3}.info-row:last-child{border-bottom:0}
    .info-row strong{color:#52606d;font-size:11px}
    .result-box{border:2px solid #d8dee6;border-left-width:8px;border-radius:8px;padding:14px 16px;margin:14px 0 20px;break-inside:avoid;background:#fbfcfd}
    .result-box.ok{border-left-color:#168451;background:#f1fbf6}.result-box.partial{border-left-color:#c47a00;background:#fff8ec}.result-box.bad{border-left-color:#c93c37;background:#fff3f2}.result-box.neutral{border-left-color:#7b8794;background:#f7f8fa}
    .result-box .status-badge{font-size:13px}
    .status-badge{display:inline-block;border-radius:999px;padding:4px 10px;font-weight:800;font-size:11px;white-space:nowrap;border:1px solid transparent}
    .status-badge.ok{background:#e7f6ee;color:#12663e;border-color:#adddc2}.status-badge.partial{background:#fff1d6;color:#8a5400;border-color:#f0c56c}.status-badge.bad{background:#ffe1df;color:#9f2a25;border-color:#efa6a1}.status-badge.neutral{background:#eef1f4;color:#4f5b67;border-color:#cfd6dd}.status-badge.doc{background:#e7f2f8;color:#1f5d78;border-color:#a9cfe0}
    .issues-list{margin:8px 0 20px;padding-left:22px}.issues-list li{margin:7px 0;padding-left:4px}
    .check-card{border:1px solid #d8dee6;border-radius:8px;margin:12px 0 16px;break-inside:avoid;page-break-inside:avoid;background:#fff;overflow:hidden}
    .check-head{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#f7f9fb;border-bottom:1px solid #d8dee6;padding:10px 12px}
    .sample-card{margin:10px 12px 12px;border:1px solid #e2e7ed;border-radius:6px;break-inside:avoid;page-break-inside:avoid;overflow:hidden}
    .sample-title{display:flex;justify-content:space-between;gap:12px;background:#fbfcfd;border-bottom:1px solid #e2e7ed;padding:8px 10px;font-weight:700}
    .sample-grid{display:grid;grid-template-columns:120px 1fr;gap:0}.sample-grid div{padding:7px 10px;border-bottom:1px solid #edf0f3}.sample-grid div:nth-child(odd){background:#fafbfc;color:#52606d;font-weight:700}
    .calc-note{font-size:11px;background:#f7f9fb;border-top:1px solid #e2e7ed;padding:8px 10px;white-space:pre-wrap}
    .plan{position:relative;width:100%;max-width:100%;display:block;border:1px solid #cfd6dd;background:#fff;padding:4px;break-inside:avoid;page-break-inside:avoid;overflow:visible}.plan img,.report-plan-image{width:100%;max-width:100%;height:auto;object-fit:contain;display:block}
    .pin-marker{position:absolute;width:0;height:0;overflow:visible;z-index:5}.pin-point{position:absolute;left:0;top:0;width:10px;height:10px;border-radius:50% 50% 50% 0;background:#fff;border:2px solid #1f2933;transform:translate(-50%,-100%) rotate(-45deg);box-shadow:0 1px 4px rgba(0,0,0,.28)}.pin-point:after{content:"";position:absolute;left:50%;top:50%;width:3px;height:3px;border-radius:50%;background:#1f2933;transform:translate(-50%,-50%)}.pin-leader{position:absolute;left:0;top:-6px;width:var(--line,10px);height:1px;background:rgba(31,41,51,.45);transform-origin:0 0;transform:rotate(var(--angle,-35deg))}.pin-chip{position:absolute;left:var(--dx,8px);top:var(--dy,-22px);transform:translateY(-50%);min-width:22px;height:18px;padding:0 6px;border-radius:5px;background:#fff;color:#1f2933;border:1.5px solid #4f6f8f;display:inline-flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:800;line-height:1;box-shadow:0 1px 4px rgba(0,0,0,.2);white-space:nowrap}.pin-chip.ok{border-color:#168451}.pin-chip.partial{border-color:#c47a00}.pin-chip.bad{border-color:#c93c37}.pin-chip.neutral{border-color:#4f6f8f}
    .appendix-block{break-before:page;page-break-before:always;margin-bottom:18px}.pin-table{font-size:11px}.pin-finding-list{display:grid;grid-template-columns:1fr;gap:8px;margin-top:10px}.pin-finding-card{border:1px solid #d8dee6;border-radius:8px;background:#fff;break-inside:avoid;page-break-inside:avoid;overflow:hidden}.pin-finding-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;background:#f7f9fb;border-bottom:1px solid #d8dee6;padding:7px 9px}.pin-finding-body{padding:8px 9px}.pin-finding-body p{white-space:pre-wrap;margin:5px 0}.pin-photo-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:7px}.pin-photo-grid.single{grid-template-columns:minmax(28mm,38mm)}.pin-photo{margin:0;break-inside:avoid;page-break-inside:avoid;align-self:start;justify-self:start;display:inline-block}.pin-photo img{width:auto;max-width:100%;height:auto;max-height:30mm;object-fit:contain;border:1px solid #cfd6dd;background:#fff;display:block}.pin-photo-grid.single .pin-photo img{height:auto;max-height:36mm}.pin-photo figcaption{font-size:9.2px;color:#697586;margin-top:3px}.compact-summary{border:1px solid #d8dee6;border-radius:8px;background:#fbfcfd;padding:8px 10px;margin:7px 0 12px}.compact-summary ul{margin:5px 0 0;padding-left:16px}.compact-summary li{margin:3px 0}.compact-check-summary p{margin:3px 0 5px}.report-section{margin:0 0 12px}.report-section.compact-keep{break-inside:avoid;page-break-inside:avoid}
    .photo-group{break-inside:avoid;page-break-inside:avoid;margin:12px 0 18px;border:1px solid #d8dee6;border-radius:8px;overflow:hidden}.photo-group h3{background:#f7f9fb;border-bottom:1px solid #d8dee6;padding:9px 11px;margin:0}
    .photo-meta{padding:8px 11px;border-bottom:1px solid #edf0f3}.photo-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:11px}.photo img{width:100%;height:180px;object-fit:cover;border:1px solid #cfd6dd;background:#fff}.photo p{font-size:10.5px;color:#697586;margin:5px 0 0}.photo-analysis{padding:6px 8px;border-left:3px solid #f4c542;background:#f7f9fb;color:#1f2933}
    .overview-report-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:8px 0 18px}.overview-report-photo{break-inside:avoid;page-break-inside:avoid;border:1px solid #d8dee6;border-radius:8px;overflow:hidden;background:#fff}.overview-report-photo img{width:100%;height:120px;object-fit:cover;display:block;background:#f7f9fb}.overview-report-photo figcaption{padding:8px 10px;font-size:11px;color:#52606d}.overview-report-photo strong{display:block;color:#17212b;margin-bottom:3px}
    .signature-report{break-inside:avoid;page-break-inside:avoid;margin:10px 0 14px;border:1px solid #d8dee6;border-radius:8px;padding:10px}.signature-print-box{width:90mm;max-width:100%;height:35mm;border-bottom:1px solid #25313d;display:flex;align-items:center;justify-content:center;background:#fff;margin-top:8px}.signature-image{display:block;max-width:80mm;max-height:28mm;width:auto;height:auto;object-fit:contain;background:#fff}.signature-empty{width:90mm;max-width:100%;height:35mm;border:1px dashed #9aa5b1;border-bottom:1px solid #25313d;display:grid;place-items:center;color:#6b7280;background:#fff;margin-top:8px}
    .footer-note{margin-top:28px;border-top:1px solid #d8dee6;padding-top:8px;color:#697586;font-size:10.5px;display:flex;justify-content:space-between;gap:12px}.manual-page-footer{position:absolute;right:0;color:#697586;font-size:10px;border-top:1px solid #d8dee6;padding-top:3px;background:#fff}.report-total-pages{font-weight:800;color:#17212b}
    .page-break,.page-break-before{break-before:page;page-break-before:always}.avoid-break{break-inside:avoid;page-break-inside:avoid}
    @media print{.print-btn,.save-hint{display:none}.report-export,.report-page{width:180mm;max-width:180mm;margin:0;padding:0}.signature-print-box{width:90mm;height:35mm}.signature-image{max-width:80mm!important;max-height:28mm!important;width:auto!important;height:auto!important;object-fit:contain!important}.signature-empty{width:90mm;height:35mm}.footer-note{position:static;bottom:auto;left:auto;right:auto}.page-number:after{content:""}}
  `;
  const body = `
      <div class="report-export">
      <main class="report-page">
        <header class="report-header">
          <div>
            <div class="brand">Kai BewehrungsCheck · LTH Bau</div>
            <h1>${escapeHtml(reportTitle)}</h1>
            <p class="subtitle">${escapeHtml(reportSubtitle)}</p>
          </div>
          <aside class="doc-meta">
            <div><span>Datum</span><strong>${escapeHtml(formatDate(protocolInspectionDateTime(p)))}</strong></div>
            <div><span>Protokoll</span><strong>${escapeHtml(p.id.slice(-8).toUpperCase())}</strong></div>
            
          </aside>
        </header>

        <section class="info-grid">
          <div class="info-card">
            <h3>Projektinformationen</h3>
            ${infoRow("Projekt / Bauvorhaben", p.head.projectName)}
            ${infoRow("Abnahme", p.head.acceptanceTitle)}
            ${infoRow("Art der Abnahme", p.head.acceptanceType)}
            ${followup ? infoRow("Bezug Erstabnahme", followupSourceLabel(p)) : ""}
            ${infoRow("Baustellenadresse", formatAddress(project?.address || p.head.siteAddress))}
            ${infoRow("Auftraggeber", companyReportText(clientCompany, project?.client || ""))}
            ${infoRow("Prüfingenieur", inspectorReportText(projectInspector, project?.inspector || ""))}
            ${infoRow("Bauteil / Geschoss", `${p.head.component || ""} ${p.head.floor || ""}`.trim())}
            ${infoRow("Bereich / Achsen", p.head.areaAxes)}
          </div>
          <div class="info-card">
            <h3>Prüfung</h3>
            ${infoRow("Datum / Uhrzeit", formatDate(protocolInspectionDateTime(p)))}
            ${infoRow("Prüfer / Abnehmender", ownPersonReportText(defaultInspectorPerson, p.result.inspectorName))}
            ${infoRow("Ausführende Firma", companyReportText(contractorCompany, p.head.contractor))}
            ${infoRow("Allgemeiner Planstand / Prüfstand", p.head.planDate)}
          </div>
        </section>

        <h2>Wetterdaten</h2>
        ${weatherReport(p)}

        <section class="report-section">
          <h2>Übersichtsfotos Baustelle</h2>
          ${overviewPhotosHtml}
        </section>

        <h2>${followup ? "Ergebnis der Nachbegehung" : "Ergebnis"}</h2>
        <section class="result-box ${resultClass(p.result.resultStatus)}">
          ${statusBadge(p.result.resultStatus)}
          <p>${resultClause(p.result.resultStatus) || "Ergebnis gemäß Auswahl dokumentiert."}</p>
          ${p.result.finalNote ? `<p><strong>Schlussbemerkung:</strong> ${escapeHtml(p.result.finalNote)}</p>` : ""}
        </section>

        <h2>Verwendete Planunterlagen</h2>
        ${planOverviewReport(p)}

        <h2>${followup ? "Weiterhin offene Punkte" : "Auflagen / Mängel"}</h2>
        ${issuesReport(issues)}

        <h2>${followup ? "Nachkontrollierte Punkte" : "Checkliste und Prüfstellen"}</h2>
        ${checklistReport(p)}

        ${followup ? `<h2>Neu festgestellte Punkte in der Nachbegehung</h2>${followupNewPointsReport(p)}` : ""}

        ${planAppendixHtml}
        ${unplacedFindingsHtml}

        <h2>Schlussformulierung</h2>
        <section class="info-card avoid-break">
          ${infoRow("Prüfer / Abnehmender", ownPersonReportText(defaultInspectorPerson, p.result.inspectorName))}
          ${hasDrawnSignatures(p) ? "" : infoRow("Unterschrift als Text", p.result.signatureText)}
        </section>

        <h2>Unterschriften / Kenntnisnahme</h2>
        ${signatureReport(p)}

        <footer class="footer-note">
          <span>${escapeHtml(p.head.projectName || "Kai BewehrungsCheck")}</span>
          <span>${escapeHtml(formatDate(protocolInspectionDateTime(p)))}</span>
          <span>Kai BewehrungsCheck</span>
        </footer>
      </main>
      </div>
  `;
  const fileName = reportFileName(p);
  return { css, body, title: sanitizeFileName(fileName.replace(/\.pdf$/i, "")), fileName };
}

function reportDocumentHtml(parts, { printButton = false, saveHint = false } = {}) {
  return `
    <!doctype html><html lang="de"><head><meta charset="UTF-8"><title>${escapeHtml(parts.title)}</title><style>${parts.css}</style></head>
    <body>
      ${saveHint ? `<div class="save-hint">Zum Speichern bitte im Druckdialog Ziel 'Als PDF speichern' wählen.</div>` : ""}
      ${printButton ? `<button class="print-btn" onclick="window.print()">Als PDF speichern / Druckdialog öffnen</button>` : ""}
      ${parts.body}
    </body></html>
  `;
}

function reportPrintOverrides() {
  return `
    @page{size:A4 portrait;margin:12mm}
    @media print{
      html,body{width:auto!important;min-width:0!important;min-height:auto!important;margin:0!important;background:#fff!important;overflow:visible!important}
      body{font-size:12px!important;color:#1f2933!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      body > *:not(#printReportMount){display:none!important}
      #printReportMount{display:block!important;position:static!important;inset:auto!important;width:auto!important;min-width:0!important;max-width:none!important;height:auto!important;max-height:none!important;margin:0!important;padding:0!important;background:#fff!important;overflow:visible!important;transform:none!important;opacity:1!important;visibility:visible!important}
      #printReportMount .no-print,#printReportMount .report-toolbar,#printReportMount .report-actions,#printReportMount .report-hint,#printReportMount .result-actions,#printReportMount .bottom-actions,#printReportMount .app-nav,#printReportMount .print-btn,#printReportMount .save-hint{display:none!important}
      #printReportMount .report-export,#printReportMount .report-page{display:block!important;position:static!important;width:auto!important;min-width:0!important;max-width:none!important;height:auto!important;max-height:none!important;margin:0!important;padding:0!important;background:#fff!important;color:#111!important;overflow:visible!important;transform:none!important;zoom:1!important;box-shadow:none!important}
      #printReportMount .report-header{break-inside:avoid;page-break-inside:avoid}
      #printReportMount h1,#printReportMount h2,#printReportMount h3{break-after:avoid;page-break-after:avoid}
      #printReportMount table{width:100%!important;max-width:100%!important;table-layout:fixed!important;break-inside:auto!important;page-break-inside:auto!important}
      #printReportMount tr{break-inside:avoid;page-break-inside:avoid}
      #printReportMount td,#printReportMount th{overflow-wrap:anywhere!important;word-break:break-word!important}
      #printReportMount img{max-width:100%!important;height:auto!important;break-inside:avoid;page-break-inside:avoid}
      #printReportMount .pin-finding-card{break-inside:avoid!important;page-break-inside:avoid!important}
      #printReportMount .pin-photo-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;margin-top:6px!important}
      #printReportMount .pin-photo-grid.single{grid-template-columns:minmax(28mm,38mm)!important}
      #printReportMount .pin-photo{break-inside:avoid!important;page-break-inside:avoid!important;margin:0!important;justify-self:start!important;display:inline-block!important}
      #printReportMount .pin-photo img{width:auto!important;max-width:100%!important;height:auto!important;max-height:30mm!important;object-fit:contain!important;background:#fff!important;display:block!important}
      #printReportMount .pin-photo-grid.single .pin-photo img{height:auto!important;max-height:36mm!important}
      #printReportMount .signature-print-box{width:90mm!important;height:35mm!important;max-width:100%!important}
      #printReportMount .signature-image{max-width:80mm!important;max-height:28mm!important;width:auto!important;height:auto!important;object-fit:contain!important}
      #printReportMount .signature-empty{width:90mm!important;height:35mm!important;max-width:100%!important}
      #printReportMount .check-card{break-inside:auto!important;page-break-inside:auto!important}
      #printReportMount .sample-card,#printReportMount .photo-card,#printReportMount .overview-report-photo,#printReportMount .signature-block,#printReportMount .signature-report,#printReportMount .plan,#printReportMount .plan-sheet{break-inside:avoid!important;page-break-inside:avoid!important}
      #printReportMount .appendix-block{break-before:page;page-break-before:always;break-inside:auto!important;page-break-inside:auto!important}
      #printReportMount .photo-group{break-inside:avoid!important;page-break-inside:avoid!important}
      #printReportMount .footer-note{position:static!important;bottom:auto!important;left:auto!important;right:auto!important;break-inside:avoid!important;page-break-inside:avoid!important}
      #printReportMount .page-number:after{content:""}
    }
  `;
}

function reportPrintDocumentHtml(parts) {
  return `
    <!doctype html><html lang="de"><head><meta charset="UTF-8"><title>${escapeHtml(parts.title)}</title><style>${parts.css}\n${reportPrintOverrides()}</style></head>
    <body class="print-document">
      <div id="printReportMount">${parts.body}</div>
    </body></html>
  `;
}

function preparePrintReportMount(parts) {
  let style = document.getElementById("reportPrintStyle");
  if (!style) {
    style = document.createElement("style");
    style.id = "reportPrintStyle";
    document.head.appendChild(style);
  }
  style.textContent = `${parts.css}\n${reportPrintOverrides()}`;
  let mount = document.getElementById("printReportMount");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "printReportMount";
    document.body.appendChild(mount);
  }
  mount.innerHTML = parts.body;
  return mount.querySelector(".report-export") || mount;
}

function applyPrintPageMetadata(doc) {
  const mount = doc?.getElementById("printReportMount");
  if (!mount) return { totalPages: null };
  mount.querySelectorAll(".manual-page-footer").forEach((item) => item.remove());
  doc.querySelectorAll(".report-total-pages").forEach((item) => {
    const row = item.closest("div");
    if (row) row.style.display = "none";
    item.textContent = "";
  });
  return { totalPages: null };
}
async function printReportA4() {
  const parts = state.reportView.parts || await buildReportParts();
  if (parts?.title) document.title = parts.title;
  const frame = $("#reportPrintFrame") || document.createElement("iframe");
  if (!frame.id) {
    frame.id = "reportPrintFrame";
    frame.className = "report-print-frame";
    frame.title = parts.title || "Bericht Druckansicht";
    document.body.appendChild(frame);
  }
  frame.srcdoc = reportPrintDocumentHtml(parts);
  await new Promise((resolve) => {
    const done = () => resolve();
    frame.addEventListener("load", done, { once: true });
    window.setTimeout(done, 1500);
  });
  const doc = frame.contentDocument;
  const reportElement = doc?.querySelector(".report-export");
  try {
    if (!reportElement) throw new Error("Bericht enthält keine druckbaren Inhalte.");
    const textLength = (reportElement.innerText || "").trim().length;
    const hasReportStructure = reportElement.querySelector(".report-header") && (reportElement.querySelector(".result-box") || reportElement.querySelector(".site-report-card") || reportElement.querySelector(".info-card"));
    if (textLength < 100 || !hasReportStructure) {
      throw new Error("Bericht enth?lt keine druckbaren Inhalte.");
    }
  } catch (error) {
    alert(error?.message || "Bericht enthält keine druckbaren Inhalte.");
    return;
  }
  await waitForReportReady(reportElement);
  applyPrintPageMetadata(doc);
  const printTarget = frame.contentWindow;
  if (!printTarget?.print) {
    alert("Druckdialog konnte nicht geöffnet werden. Bitte über Browser-Menü Drucken / Als PDF speichern verwenden.");
    return;
  }
  printTarget.focus();
  printTarget.print();
}
async function openReportWindow({ print = false, saveHint = false } = {}) {
  return openReportDialog({ printHint: print || saveHint });
}

async function savePdfFromA4Report() {
  await openReportDialog({ printHint: true });
  setReportPreviewMode("a4");
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  armReturnToResultAfterPrint();
  await printReportA4();
}

async function openReportDialog({ printHint = false } = {}) {
  const parts = await buildReportParts();
  const content = $("#reportPreviewContent");
  state.reportView.mode = "read";
  content.classList.remove("fit", "a4-mode");
  content.classList.add("read-mode");
  content.innerHTML = `
    <div id="reportPreviewScaler" class="report-preview-scaler read-mode"></div>
    <iframe id="reportPrintFrame" class="report-print-frame" title="Bericht Druckansicht"></iframe>
  `;
  const scaler = $("#reportPreviewScaler");
  const previewRoot = scaler.attachShadow({ mode: "open" });
  previewRoot.innerHTML = `
    <style>${parts.css}</style>
    <style>
      :host{display:block;box-sizing:border-box}
      :host(.read-mode){width:100%;min-width:0;max-width:100%;margin:0;transform:none!important}
      :host(.read-mode) .report-export,
      :host(.read-mode) .report-page{width:100%!important;min-width:0!important;max-width:100%!important;margin:0!important;padding:0!important;overflow:visible!important}
      :host(.read-mode) .report-page{box-sizing:border-box!important}
      :host(.read-mode) .report-header,
      :host(.read-mode) .info-grid,
      :host(.read-mode) .photo-grid,
      :host(.read-mode) .overview-report-grid,
      :host(.read-mode) .signature-grid{display:block!important;grid-template-columns:none!important}
      :host(.read-mode) .report-header{padding:16px!important;margin-bottom:12px!important}
      :host(.read-mode) section,
      :host(.read-mode) .section,
      :host(.read-mode) .result-box,
      :host(.read-mode) .summary-box,
      :host(.read-mode) .appendix-block,
      :host(.read-mode) .photo-group{max-width:100%!important;box-sizing:border-box!important}
      :host(.read-mode) .doc-meta,
      :host(.read-mode) .info-row,
      :host(.read-mode) .report-card,
      :host(.read-mode) .check-card,
      :host(.read-mode) .sample-card,
      :host(.read-mode) .photo-card,
      :host(.read-mode) .overview-report-photo,
      :host(.read-mode) .signature-report{width:100%!important;max-width:100%!important;margin-bottom:10px!important}
      :host(.read-mode) .report-card,
      :host(.read-mode) .check-card,
      :host(.read-mode) .sample-card,
      :host(.read-mode) .photo-card{box-sizing:border-box!important}
      :host(.read-mode) table{display:block!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;table-layout:auto!important}
      :host(.read-mode) thead,
      :host(.read-mode) tbody,
      :host(.read-mode) tr{width:100%!important}
      :host(.read-mode) th,
      :host(.read-mode) td{word-break:break-word!important;white-space:normal!important}
      :host(.read-mode) h1{font-size:22px!important;line-height:1.2!important}
      :host(.read-mode) h2{font-size:18px!important;line-height:1.25!important}
      :host(.read-mode) h3{font-size:15px!important;line-height:1.3!important}
      :host(.read-mode) .report-plan-image,
      :host(.read-mode) .overview-report-photo img,
      :host(.read-mode) .photo-card img,
      :host(.read-mode) .signature-image{max-width:100%!important;height:auto!important}
      :host(.a4-mode) .report-export,
      :host(.a4-mode) .report-page{max-width:none!important;overflow:visible!important}
      .report-page{box-shadow:0 2px 12px rgba(31,41,51,0.16)}
    </style>
    ${parts.body}
  `;
  const printFrame = $("#reportPrintFrame");
  printFrame.srcdoc = reportPrintDocumentHtml(parts);
  state.reportView.parts = parts;
  updateReportPreviewModeButtons();
  $(".report-browser-hint").textContent = printHint
    ? "Zum Speichern bitte auf „Druckdialog öffnen“ tippen und im Druckdialog als Ziel „Als PDF speichern“ wählen."
    : "Lesemodus ist für das Handy optimiert. Die A4-Ansicht dient zur Kontrolle des Ausdrucks.";
  document.body.classList.add("report-open");
  $("#reportDialog").showModal();
  requestAnimationFrame(updateReportPreviewFrame);
}

async function saveReportHtml() {
  const parts = state.reportView.parts || await buildReportParts();
  const html = reportDocumentHtml(parts, { printButton: false, saveHint: false });
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = sanitizeFileName((parts.fileName || "bewehrungsbericht.pdf").replace(/\.pdf$/i, ".html"));
  link.click();
  URL.revokeObjectURL(url);
}

async function shareReportFile() {
  const parts = state.reportView.parts || await buildReportParts();
  const text = buildReportShareText();
  const title = reportShareTitle();
  const html = reportDocumentHtml(parts, { printButton: false, saveHint: false });
  const fileName = sanitizeFileName((parts.fileName || "bewehrungsbericht.pdf").replace(/\.pdf$/i, ".html"));
  try {
    if (typeof File === "undefined") throw new Error("File API nicht verfügbar");
    const file = new File([html], fileName, { type: "text/html" });
    if (!navigator.share || !navigator.canShare || !navigator.canShare({ files: [file] })) {
      alert("Berichtsdatei kann auf diesem Gerät nicht direkt geteilt werden. Bitte 'Bericht als HTML speichern' verwenden oder den WhatsApp-Text kopieren.");
      return;
    }
    await navigator.share({ title, text, files: [file] });
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error(error);
    alert("Berichtsdatei konnte nicht geteilt werden. Bitte 'Bericht als HTML speichern' verwenden oder den WhatsApp-Text kopieren.");
  }
}

function triggerSavedPdfSharePicker() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/pdf,.pdf";
  input.className = "visually-hidden";
  input.setAttribute("aria-hidden", "true");
  input.addEventListener("change", async () => {
    const file = input.files?.[0] || null;
    input.remove();
    await shareSavedPdfFile(file);
  }, { once: true });
  document.body.appendChild(input);
  try {
    input.click();
  } catch (error) {
    input.remove();
    state.lastPdfFileShareDebug = {
      fileName: "",
      fileType: "",
      fileSize: 0,
      hasNavigatorShare: !!navigator.share,
      hasNavigatorCanShare: !!navigator.canShare,
      canShareResult: null,
      errorName: error?.name || "FilePickerError",
      errorMessage: error?.message || String(error || "")
    };
    alert("PDF-Dateiauswahl konnte nicht geöffnet werden. Bitte die PDF direkt aus dem Dateimanager teilen.");
  }
}

async function shareSavedPdfFile(file) {
  if (!file) return;
  const looksLikePdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name || "");
  if (!looksLikePdf) {
    state.lastPdfFileShareDebug = {
      fileName: file.name || "",
      fileType: file.type || "",
      fileSize: file.size || 0,
      hasNavigatorShare: !!navigator.share,
      hasNavigatorCanShare: !!navigator.canShare,
      canShareResult: null,
      errorName: "InvalidFileType",
      errorMessage: "Ausgewählte Datei ist keine PDF."
    };
    alert("Bitte eine PDF-Datei auswählen.");
    return;
  }
  const debug = {
    fileName: file.name || "",
    fileType: file.type || "",
    fileSize: file.size || 0,
    hasNavigatorShare: !!navigator.share,
    hasNavigatorCanShare: !!navigator.canShare,
    canShareResult: null,
    errorName: "",
    errorMessage: ""
  };
  state.lastPdfFileShareDebug = debug;
  if (!navigator.share) {
    debug.errorName = "ShareUnavailable";
    debug.errorMessage = "navigator.share fehlt";
    alert("Direktes Teilen dieser PDF wird auf diesem Gerät/Browser nicht unterstützt. Bitte die PDF direkt aus dem Dateimanager teilen.");
    return;
  }
  const shareData = { title: "Bewehrungsbericht", text: buildReportShareText({ compact: true }), files: [file] };
  try {
    if (navigator.canShare) {
      try {
        debug.canShareResult = navigator.canShare(shareData);
      } catch (canShareError) {
        debug.canShareResult = false;
        debug.errorName = canShareError?.name || "CanShareError";
        debug.errorMessage = canShareError?.message || String(canShareError || "");
      }
    }
    await navigator.share(shareData);
  } catch (error) {
    if (error?.name === "AbortError") return;
    debug.errorName = error?.name || "ShareError";
    debug.errorMessage = error?.message || String(error || "");
    console.error("Gespeicherte PDF konnte nicht geteilt werden", { error, debug });
    alert("Direktes Teilen dieser PDF wird auf diesem Gerät/Browser nicht unterstützt. Bitte die PDF direkt aus dem Dateimanager teilen.");
  }
}

async function shareReportText() {
  const text = buildReportShareText({ compact: true });
  const title = reportShareTitle();
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      return;
    }
    await copyTextToClipboard(text);
    alert("Berichtstext wurde kopiert. Bitte in WhatsApp, Mail oder eine andere App einfügen.");
  } catch (error) {
    if (error?.name === "AbortError") return;
    try {
      await copyTextToClipboard(text);
      alert("Berichtstext wurde kopiert. Bitte in WhatsApp, Mail oder eine andere App einfügen.");
    } catch (copyError) {
      console.error(copyError);
      alert("Berichtstext konnte nicht geteilt oder kopiert werden.");
    }
  }
}

function reportShareTitle() {
  const p = state.current;
  return `Bewehrungsbericht ${p?.head?.projectName || "Kai BewehrungsCheck"}`.trim();
}

function buildReportShareText({ compact = false } = {}) {
  const p = state.current;
  if (!p) return "Bewehrungsbericht Kai BewehrungsCheck";
  p.checkpoints?.forEach(updateCheckStatus);
  const issues = sampleIssues(p).length;
  const title = p.head.acceptanceTitle || p.head.acceptanceType || "Bewehrungsabnahme";
  const project = p.head.projectName || "ohne Projektangabe";
  const component = [p.head.component, p.head.floor].filter(Boolean).join(" / ") || "ohne Angabe";
  const area = p.head.areaAxes || "ohne Angabe";
  const date = formatDate(protocolInspectionDateTime(p));
  const result = p.result?.resultStatus || "ohne Ergebnis";
  const lines = compact ? [
    `Bewehrungsabnahme – ${project}`,
    `Abnahme: ${title}`,
    `Bauteil: ${component}`,
    `Bereich: ${area}`,
    `Ergebnis: ${result}`,
    `Offene Punkte: ${issues}`,
    "Bitte Bericht beachten."
  ] : [
    `Bewehrungsbericht – ${project}`,
    `Abnahme: ${title}`,
    `Datum: ${date}`,
    `Bauteil / Bereich: ${component} · ${area}`,
    `Ergebnis: ${result}`,
    `Offene Auflagen/Mängel: ${issues}`,
    "Bericht/PDF siehe Anlage bzw. separat."
  ];
  return lines.join("\n");
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}
function updateReportPreviewFrame() {
  const content = $("#reportPreviewContent");
  const scaler = $("#reportPreviewScaler");
  const root = scaler?.shadowRoot;
  const page = root?.querySelector(".report-export") || root?.querySelector(".report-page");
  if (!content || !scaler || !page) return;
  const readMode = state.reportView.mode !== "a4";
  content.classList.toggle("read-mode", readMode);
  content.classList.toggle("a4-mode", !readMode);
  scaler.classList.toggle("read-mode", readMode);
  scaler.classList.toggle("a4-mode", !readMode);
  scaler.style.transform = "none";
  scaler.style.width = readMode ? "100%" : "max-content";
  scaler.style.height = "auto";
  scaler.style.minWidth = readMode ? "0" : "max-content";
  scaler.style.marginLeft = readMode ? "0" : "auto";
  scaler.style.marginRight = readMode ? "0" : "auto";
  if (readMode) return;
  const baseWidth = Math.max(1, page.getBoundingClientRect().width || scaler.scrollWidth || 718);
  const baseHeight = Math.max(1, scaler.scrollHeight || page.getBoundingClientRect().height || 800);
  const scale = 1;
  scaler.style.transformOrigin = "top left";
  scaler.style.transform = `scale(${scale})`;
  scaler.style.width = `${Math.ceil(baseWidth * scale)}px`;
  scaler.style.height = `${Math.ceil(baseHeight * scale)}px`;
}

function setReportPreviewMode(mode) {
  const content = $("#reportPreviewContent");
  if (!content) return;
  state.reportView.mode = mode === "a4" ? "a4" : "read";
  updateReportPreviewModeButtons();
  updateReportPreviewFrame();
}

function updateReportPreviewModeButtons() {
  const readMode = state.reportView.mode !== "a4";
  $("#reportReadModeBtn")?.classList.toggle("active", readMode);
  $("#reportA4ModeBtn")?.classList.toggle("active", !readMode);
}

function pdfEscape(text) {
  return String(text || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[\r\n]+/g, " ");
}

function dataUrlToBytes(dataUrl) {
  const base64 = String(dataUrl || "").split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function safeCanvasToBlob(canvas, type = "image/jpeg", quality = 0.8, context = "Bild") {
  try {
    return await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob || null), type, quality);
    });
  } catch (error) {
    console.warn("PDF-Bild konnte nicht exportiert werden", { context, error });
    return null;
  }
}

async function prepareReportImageSafe(source, options = {}, context = "Bild") {
  try {
    const dataUrl = await prepareImageForReport(source, options);
    return dataUrl || "";
  } catch (error) {
    console.warn("PDF-Bild konnte nicht vorbereitet werden", { context, error });
    return "";
  }
}

async function prepareSignatureImageForPdf(source) {
  if (!source) return "";
  try {
    const image = await imageFromDataUrl(source);
    const sourceWidth = image.naturalWidth || image.width || 1;
    const sourceHeight = image.naturalHeight || image.height || 1;
    const canvas = document.createElement("canvas");
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, sourceWidth, sourceHeight);
    const pixels = ctx.getImageData(0, 0, sourceWidth, sourceHeight).data;
    let minX = sourceWidth;
    let minY = sourceHeight;
    let maxX = -1;
    let maxY = -1;
    for (let yPos = 0; yPos < sourceHeight; yPos += 1) {
      for (let xPos = 0; xPos < sourceWidth; xPos += 1) {
        const offset = (yPos * sourceWidth + xPos) * 4;
        const alpha = pixels[offset + 3];
        const r = pixels[offset];
        const g = pixels[offset + 1];
        const b = pixels[offset + 2];
        if (alpha > 16 && (r < 245 || g < 245 || b < 245)) {
          minX = Math.min(minX, xPos);
          minY = Math.min(minY, yPos);
          maxX = Math.max(maxX, xPos);
          maxY = Math.max(maxY, yPos);
        }
      }
    }
    if (maxX < minX || maxY < minY) {
      return prepareReportImageSafe(source, { maxWidth: 1000, maxHeight: 420, quality: 0.86, mimeType: "image/jpeg" }, "Unterschrift");
    }
    const pad = Math.max(8, Math.round(Math.max(sourceWidth, sourceHeight) * 0.025));
    const cropX = Math.max(0, minX - pad);
    const cropY = Math.max(0, minY - pad);
    const cropW = Math.min(sourceWidth - cropX, maxX - minX + 1 + pad * 2);
    const cropH = Math.min(sourceHeight - cropY, maxY - minY + 1 + pad * 2);
    const scale = Math.min(1, 1000 / cropW, 420 / cropH);
    const outW = Math.max(1, Math.round(cropW * scale));
    const outH = Math.max(1, Math.round(cropH * scale));
    const out = document.createElement("canvas");
    out.width = outW;
    out.height = outH;
    const outCtx = out.getContext("2d");
    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, 0, outW, outH);
    outCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, outW, outH);
    const blob = await safeCanvasToBlob(out, "image/jpeg", 0.86, "Unterschrift");
    return blob ? blobToDataUrl(blob) : "";
  } catch (error) {
    console.warn("Unterschrift konnte nicht für PDF vorbereitet werden", error);
    return prepareReportImageSafe(source, { maxWidth: 1000, maxHeight: 420, quality: 0.86, mimeType: "image/jpeg" }, "Unterschrift");
  }
}

function pdfWinAnsiBytes(text) {
  const map = new Map([[0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84], [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88], [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c], [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93], [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97], [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b], [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f]]);
  const bytes = [];
  for (const char of String(text || "")) {
    const code = char.codePointAt(0);
    if (code === 0x0a || code === 0x0d || code === 0x09) bytes.push(0x20);
    else if (code <= 0xff) bytes.push(code);
    else bytes.push(map.get(code) || 0x3f);
  }
  return bytes;
}

function pdfHexText(text) {
  return `<${pdfWinAnsiBytes(text).map((byte) => byte.toString(16).padStart(2, "0")).join("")}>`;
}

function pdfRgb(hex) {
  const value = String(hex || "#1f2933").replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

function pdfImageSourceType(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);/i);
  return (match?.[1] || "").toLowerCase();
}

async function pdfImageInfo(dataUrl, context = "Bild") {
  if (!dataUrl) return null;
  let source = dataUrl;
  if (pdfImageSourceType(source) !== "image/jpeg" && pdfImageSourceType(source) !== "image/jpg") {
    source = await prepareReportImageSafe(source, { maxWidth: 1600, maxHeight: 1600, quality: 0.78, mimeType: "image/jpeg" }, context);
  }
  if (!source) return null;
  try {
    const image = await imageFromDataUrl(source);
    return {
      dataUrl: source,
      bytes: dataUrlToBytes(source),
      width: image.naturalWidth || image.width || 1,
      height: image.naturalHeight || image.height || 1,
      context
    };
  } catch (error) {
    console.warn("PDF-Bild konnte nicht gelesen werden", { context, error });
    return null;
  }
}

function collectReportPhotoGroups(p) {
  const groups = [];
  const usedPhotoIds = new Set();
  reportPlansForProtocol(p).forEach((plan) => {
    p.pins
      .filter((pin) => pinHasReportPlacement(pin, plan))
      .sort((a, b) => (a.number || 0) - (b.number || 0))
      .forEach((pin) => pin.photos.forEach((photo, index) => {
        const placement = reportPlacementForPlan(pin, plan);
        let group = groups.find((item) => item.key === `pin:${pin.id}`);
        if (!group) {
          group = { key: `pin:${pin.id}`, title: `${pinLabel(pin)} - ${pin.title || "Pin"}`, status: pin.status, note: pin.note, meta: `Plan ${displayPlanNumber(plan) || plan.fileName} / Seite ${placement?.pageNumber || pin.pageNumber || 1}`, photos: [] };
          groups.push(group);
        }
        if (!usedPhotoIds.has(photo.id)) {
          usedPhotoIds.add(photo.id);
          group.photos.push({ label: `Foto ${group.photos.length + 1}`, photo });
        }
      }));
  });
  p.checkpoints.forEach((check) => {
    check.samples?.forEach((sample) => {
      sample.photos?.forEach((photo, index) => {
        let group = groups.find((item) => item.key === `sample:${sample.id}`);
        if (!group) {
          group = { key: `sample:${sample.id}`, title: `${check.title} - Prüfstelle ${sample.number}${sample.location ? " - " + sample.location : ""}`, status: sample.status, note: sample.note, meta: sample.pinId ? pinName(sample.pinId) : "", photos: [] };
          groups.push(group);
        }
        if (!usedPhotoIds.has(photo.id)) {
          usedPhotoIds.add(photo.id);
          group.photos.push({ label: `Foto ${group.photos.length + 1}`, photo });
        }
      });
    });
  });
  p.checkpoints.forEach((check) => check.photos.forEach((photo, index) => {
    let group = groups.find((item) => item.key === `check:${check.id}`);
    if (!group) {
      group = { key: `check:${check.id}`, title: check.title, status: check.status, note: check.note, meta: check.pinId ? pinName(check.pinId) : "", photos: [] };
      groups.push(group);
    }
    if (!usedPhotoIds.has(photo.id)) {
      usedPhotoIds.add(photo.id);
      group.photos.push({ label: `Foto ${group.photos.length + 1}`, photo });
    }
  }));
  return groups.filter((group) => group.photos.length);
}

async function buildStructuredReportPdfModel(parts, logStep = null) {
  const p = state.current;
  const project = projectById(p.projectId);
  const clientCompany = projectClientRecord(project);
  const contractorCompany = projectContractorRecord(project, p);
  const projectInspector = projectInspectorRecord(project);
  const defaultInspectorPerson = projectDefaultInspectorRecord(project, p);
  p.checkpoints.forEach(updateCheckStatus);
  const reportPlans = reportPlansForProtocol(p);
  const issues = sampleIssues(p);
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 42;
  const bottom = 56;
  const contentWidth = pageWidth - margin * 2;
  const pdfTheme = {
    cardPadding: 12,
    cardGap: 14,
    border: "#d8dee6",
    borderStrong: "#c6d0da",
    headerFill: "#f3f6f9",
    cardFill: "#ffffff",
    mutedFill: "#fbfcfd",
    text: "#1f2933",
    muted: "#52606d",
    accent: "#8fa3b5"
  };
  const pages = [];
  const images = [];
  let page;
  let y;
  const warnings = [];
  const imageDebug = {
    overviewFound: 0,
    overviewEmbedded: 0,
    photoFound: 0,
    photoEmbedded: 0,
    signaturesFound: 0,
    signaturesEmbedded: 0,
    signatureFields: [],
    errors: []
  };
  const logPdfStep = typeof logStep === "function" ? logStep : () => {};
  const signatureFieldName = (signature) => ["signatureData", "dataUrl", "imageData", "signature", "signatureImage"].find((key) => !!signature?.[key]) || "";
  const signatureSource = (signature) => {
    const field = signatureFieldName(signature);
    return field ? signature[field] : "";
  };
  const newPage = () => {
    page = { ops: [] };
    pages.push(page);
    y = margin;
  };
  const ensure = (height = 20) => {
    if (!page || y + height > pageHeight - bottom) newPage();
  };
  const ensureSection = (height = 120) => ensure(height);
  const addOp = (op) => page.ops.push(op);
  const lineHeight = (size) => size + 3.8;
  const splitLines = (text, maxWidth = contentWidth, size = 10) => {
    const value = String(text || "").replace(/\s+/g, " ").trim();
    if (!value) return [];
    const maxChars = Math.max(8, Math.floor(maxWidth / (size * 0.50)));
    const sourceWords = value.split(" ").filter(Boolean);
    const words = [];
    sourceWords.forEach((word) => {
      if (word.length <= maxChars) {
        words.push(word);
        return;
      }
      for (let index = 0; index < word.length; index += maxChars) {
        words.push(word.slice(index, index + maxChars));
      }
    });
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > maxChars && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    if (line) lines.push(line);
    return lines;
  };
  const addTextLine = (text, x = margin, size = 10, style = {}) => {
    ensure(size + 6);
    addOp({ type: "text", text: String(text || ""), x, y, size, font: style.bold ? "F2" : "F1", color: style.color || "#1f2933" });
    y += size + (style.gap ?? 4);
  };
  const addText = (text, options = {}) => {
    const size = options.size || 10;
    const maxWidth = options.maxWidth || contentWidth;
    const x = options.x || margin;
    const lines = splitLines(text, maxWidth, size);
    if (!lines.length) {
      if (options.blank !== false) y += size + 4;
      return 0;
    }
    lines.forEach((line) => addTextLine(line, x, size, options));
    return lines.length;
  };
  const addRect = (x, rectY, width, height, options = {}) => {
    addOp({ type: "rect", x, y: rectY, width, height, fill: options.fill || "", stroke: options.stroke || "#d8dee6", lineWidth: options.lineWidth ?? 0.7 });
  };
  const addRule = (ruleY = y, color = "#aab4bf", width = 0.8) => addOp({ type: "line", x1: margin, y1: ruleY, x2: pageWidth - margin, y2: ruleY, color, width });
  const addHeading = (text, options = {}) => {
    if (options.pageBreak && pages.length) newPage();
    ensureSection(options.keepWith || 96);
    y += pages.length === 1 && y < margin + 22 ? 0 : 10;
    const size = options.size || 13.0;
    const lines = splitLines(text, contentWidth - 24, size).slice(0, 2);
    const boxHeight = Math.max(28, lines.length * lineHeight(size) + 11);
    addRect(margin, y - 2, contentWidth, boxHeight, { fill: "#f6f8fa", stroke: "#d8dee6", lineWidth: 0.55 });
    lines.forEach((line, index) => addOp({ type: "text", text: line, x: margin + 12, y: y + 15 + index * lineHeight(size), size, font: "F2", color: "#17212b" }));
    y += boxHeight + 5;
  };
  const addBadge = (text, x, badgeY, style = {}) => {
    const label = String(text || "offen");
    const width = Math.min(145, Math.max(48, label.length * 5.2 + 16));
    addRect(x, badgeY - 11, width, 17, { fill: style.fill || "#eef1f4", stroke: style.stroke || "#cfd6dd", lineWidth: 0.7 });
    addOp({ type: "text", text: label, x: x + 6, y: badgeY + 1, size: 8, font: "F2", color: style.color || "#4f5b67" });
    return width;
  };
  const statusStyle = (status) => {
    const cls = resultClass(status);
    if (cls === "ok") return { fill: "#e7f6ee", stroke: "#adddc2", color: "#12663e" };
    if (cls === "partial") return { fill: "#fff1d6", stroke: "#f0c56c", color: "#8a5400" };
    if (cls === "bad") return { fill: "#ffe1df", stroke: "#efa6a1", color: "#9f2a25" };
    return { fill: "#eef1f4", stroke: "#cfd6dd", color: "#4f5b67" };
  };
  const addKeyValue = (key, value, options = {}) => {
    if (!value && !options.showEmpty) return;
    const x = options.x || margin;
    const width = options.width || contentWidth;
    const keyWidth = options.keyWidth || Math.min(142, width * 0.36);
    const size = options.size || 9.0;
    const valueText = value || "-";
    const availableValueWidth = Math.max(40, width - keyWidth - 10);
    const shouldStack = !!options.stack || String(valueText).length > 58 || splitLines(valueText, availableValueWidth, size).length > 2;
    const valueMaxWidth = shouldStack ? width - 16 : availableValueWidth;
    const valueLines = splitLines(valueText, valueMaxWidth, size);
    const labelHeight = lineHeight(size);
    const height = shouldStack
      ? Math.max(28, labelHeight + Math.max(1, valueLines.length) * lineHeight(size) + 10)
      : Math.max(18, valueLines.length * lineHeight(size) + 7);
    ensure(height + 2);
    if (options.rowFill) addRect(x, y - 2, width, height, { fill: options.rowFill, stroke: "#edf0f3", lineWidth: 0.4 });
    addOp({ type: "text", text: `${key}:`, x: x + (shouldStack ? 6 : 0), y: y + 11, size, font: "F2", color: "#52606d" });
    const valueX = shouldStack ? x + 6 : x + keyWidth;
    const valueY = shouldStack ? y + 11 + labelHeight : y + 11;
    const lines = valueLines.length ? valueLines : ["-"];
    lines.forEach((line, index) => addOp({ type: "text", text: line, x: valueX, y: valueY + index * lineHeight(size), size, font: "F1", color: "#1f2933" }));
    y += height;
  };
  const addInfoCard = (title, rows, x, cardY, width) => {
    const startPage = page;
    const savedY = y;
    const opStart = page.ops.length;
    y = cardY + 34;
    rows.forEach((row, index) => addKeyValue(row[0], row[1], { x: x + 14, width: width - 28, keyWidth: width > 360 ? 156 : Math.min(112, (width - 28) * 0.40), stack: true, rowFill: index % 2 ? "" : pdfTheme.mutedFill }));
    const endY = y + 10;
    if (startPage === page) {
      page.ops.splice(opStart, 0,
        { type: "rect", x, y: cardY, width, height: endY - cardY, fill: pdfTheme.cardFill, stroke: pdfTheme.borderStrong, lineWidth: 0.85 },
        { type: "rect", x, y: cardY, width, height: 28, fill: pdfTheme.headerFill, stroke: pdfTheme.borderStrong, lineWidth: 0.65 },
        { type: "text", text: title, x: x + 14, y: cardY + 18, size: 9.4, font: "F2", color: "#26323f" }
      );
    }
    y = savedY;
    return endY;
  };
  const addInfoGrid = (leftTitle, leftRows, rightTitle, rightRows) => {
    ensure(220);
    const width = contentWidth;
    const leftEnd = addInfoCard(leftTitle, leftRows, margin, y, width);
    y = leftEnd + 10;
    const rightEnd = addInfoCard(rightTitle, rightRows, margin, y, width);
    y = rightEnd + pdfTheme.cardGap;
  };
  const addCardShell = (title, startY, endY, options = {}) => {
    const x = options.x || margin;
    const width = options.width || contentWidth;
    const titleSize = options.titleSize || 9.5;
    const titleLines = splitLines(title, width - 28, titleSize).slice(0, 2);
    page.ops.splice(options.opStart ?? page.ops.length, 0,
      { type: "rect", x, y: startY, width, height: endY - startY, fill: options.fill || pdfTheme.cardFill, stroke: options.stroke || pdfTheme.borderStrong, lineWidth: options.lineWidth ?? 0.85 },
      { type: "rect", x, y: startY, width, height: 30, fill: options.headerFill || pdfTheme.headerFill, stroke: options.stroke || pdfTheme.borderStrong, lineWidth: 0.65 },
      ...titleLines.map((line, index) => ({ type: "text", text: line, x: x + 14, y: startY + 18 + index * lineHeight(titleSize), size: titleSize, font: "F2", color: options.titleColor || "#26323f" }))
    );
  };
  const addTableCard = (title, columns, rows, options = {}) => {
    ensure(options.minHeight || 70);
    const startPage = page;
    const startY = y;
    const opStart = page.ops.length;
    y = startY + 38;
    addTable(columns, rows, { ...options, x: margin + 12, width: contentWidth - 24 });
    const endY = y + 2;
    if (startPage === page) addCardShell(title, startY, endY, { opStart, accent: options.accent });
    y = endY + pdfTheme.cardGap;
  };
  const addTextCard = (title, textValue, options = {}) => {
    ensure(options.minHeight || 58);
    const startPage = page;
    const startY = y;
    const opStart = page.ops.length;
    y = startY + 36;
    addText(textValue, { x: margin + 12, maxWidth: contentWidth - 24, size: options.size || 9, color: options.color || pdfTheme.muted, blank: false });
    const endY = y + 10;
    if (startPage === page) addCardShell(title, startY, endY, { opStart, accent: options.accent, fill: options.fill });
    y = endY + pdfTheme.cardGap;
  };
  const addTable = (columns, rows, options = {}) => {
    if (!rows.length && !options.emptyText) return;
    if (!rows.length) {
      ensure(24);
      addRect(options.x || margin, y, options.width || contentWidth, 24, { fill: "#fbfcfd", stroke: "#d8dee6", lineWidth: 0.5 });
      addText(options.emptyText, { size: 9, color: "#52606d", x: (options.x || margin) + 8, maxWidth: (options.width || contentWidth) - 16, blank: false });
      y += 8;
      return;
    }
    const tableWidth = options.width || contentWidth;
    const x = options.x || margin;
    const weights = columns.map((col) => col.weight || 1);
    const totalWeight = weights.reduce((sum, value) => sum + value, 0) || 1;
    const widths = weights.map((value) => tableWidth * value / totalWeight);
    const headerHeight = 22;
    ensure(headerHeight + 16);
    addRect(x, y, tableWidth, headerHeight, { fill: "#e9eff5", stroke: "#cbd5df", lineWidth: 0.7 });
    let cellX = x;
    columns.forEach((col, index) => {
      addOp({ type: "text", text: col.title, x: cellX + 6, y: y + 14, size: 7.8, font: "F2", color: "#26323f" });
      if (index) addOp({ type: "line", x1: cellX, y1: y, x2: cellX, y2: y + headerHeight, color: "#cbd5df", width: 0.45 });
      cellX += widths[index];
    });
    y += headerHeight;
    rows.forEach((row, rowIndex) => {
      const cellLines = columns.map((col, index) => splitLines(row[col.key] ?? "", Math.max(20, widths[index] - 12), options.size || 8.2));
      const rowHeight = Math.max(22, Math.max(...cellLines.map((lines) => lines.length || 1)) * lineHeight(options.size || 8.2) + 10);
      ensure(rowHeight + 4);
      addRect(x, y, tableWidth, rowHeight, { fill: rowIndex % 2 ? "#ffffff" : "#fbfcfd", stroke: "#d8dee6", lineWidth: 0.45 });
      cellX = x;
      columns.forEach((col, index) => {
        if (index) addOp({ type: "line", x1: cellX, y1: y, x2: cellX, y2: y + rowHeight, color: "#d8dee6", width: 0.35 });
        const lines = cellLines[index].length ? cellLines[index] : ["-"];
        lines.slice(0, options.maxLines || 4).forEach((line, lineIndex) => addOp({ type: "text", text: line, x: cellX + 6, y: y + 13 + lineIndex * lineHeight(options.size || 8.2), size: options.size || 8.2, font: col.bold ? "F2" : "F1", color: "#1f2933" }));
        cellX += widths[index];
      });
      y += rowHeight;
    });
    y += 10;
  };
  const addImage = async (dataUrl, caption, options = {}) => {
    const info = await pdfImageInfo(dataUrl, caption || "Bild");
    if (!info) {
      warnings.push(caption || "Bild");
      addText("Bild konnte aus Browser-Sicherheitsgründen nicht eingebettet werden.", { size: 9, color: "#9f2a25" });
      return null;
    }
    const imageIndex = images.push(info) - 1;
    const maxWidth = options.maxWidth || contentWidth;
    const maxHeight = options.maxHeight || 250;
    const scale = Math.min(maxWidth / info.width, maxHeight / info.height, 1);
    const width = Math.max(1, info.width * scale);
    const height = Math.max(1, info.height * scale);
    if (options.allowPageBreak !== false) ensure(height + (caption ? 24 : 8));
    const x = options.x ?? margin;
    addOp({ type: "image", imageIndex, x, y, width, height });
    const imageBox = { x, y, width, height };
    y += height + 6;
    if (caption) addText(caption, { size: 8.2, color: "#697586", maxWidth: width, x });
    return imageBox;
  };
  const addImageGrid = async (items, options = {}) => {
    const columns = options.columns || 2;
    const gap = 10;
    const cellWidth = (contentWidth - gap * (columns - 1)) / columns;
    for (let index = 0; index < items.length; index += columns) {
      const row = items.slice(index, index + columns);
      const prepared = [];
      for (const item of row) {
        const info = await pdfImageInfo(item.src, item.caption || "Bild");
        if (!info) {
          warnings.push(item.caption || "Bild");
          prepared.push(null);
        } else {
          const imageIndex = images.push(info) - 1;
          const frameHeight = options.maxHeight || 150;
          let imageHeight = Math.min(frameHeight, info.height * Math.min(cellWidth / info.width, frameHeight / info.height, 1));
          let imageWidth = Math.min(cellWidth, info.width * imageHeight / info.height);
          if (options.minImageWidth && imageWidth < Math.min(options.minImageWidth, cellWidth)) {
            const boostedWidth = Math.min(options.minImageWidth, cellWidth);
            const boostedHeight = Math.min(frameHeight, info.height * boostedWidth / info.width);
            imageWidth = Math.min(cellWidth, boostedWidth);
            imageHeight = boostedHeight;
          }
          prepared.push({ ...item, info, imageIndex, imageWidth, imageHeight });
        }
      }
      const rowHeight = Math.max(...prepared.map((item) => item ? item.imageHeight + 34 : 42), 42);
      ensure(rowHeight + 10);
      row.forEach((item, cellIndex) => {
        const x = margin + cellIndex * (cellWidth + gap);
        const preparedItem = prepared[cellIndex];
        addRect(x, y, cellWidth, rowHeight, { fill: "#ffffff", stroke: "#d8dee6", lineWidth: 0.6 });
        if (preparedItem) {
          addOp({ type: "image", imageIndex: preparedItem.imageIndex, x: x + (cellWidth - preparedItem.imageWidth) / 2, y: y + 6, width: preparedItem.imageWidth, height: preparedItem.imageHeight });
          const captionLines = splitLines(item.caption || "", cellWidth - 12, 8.2).slice(0, 3);
          captionLines.forEach((line, lineIndex) => addOp({ type: "text", text: line, x: x + 6, y: y + preparedItem.imageHeight + 19 + lineIndex * lineHeight(8.2), size: 8.2, font: lineIndex === 0 && item.boldCaption ? "F2" : "F1", color: "#52606d" }));
        } else {
          addOp({ type: "text", text: "Bild konnte nicht eingebettet werden.", x: x + 6, y: y + 20, size: 8.2, font: "F1", color: "#9f2a25" });
        }
      });
      y += rowHeight + 10;
    }
  };
  const estimateImageGridFirstRowHeight = async (items, options = {}) => {
    if (!items.length) return 58;
    const columns = options.columns || 2;
    const gap = 10;
    const cellWidth = (contentWidth - gap * (columns - 1)) / columns;
    const row = items.slice(0, columns);
    const heights = [];
    for (const item of row) {
      const info = await pdfImageInfo(item.src, item.caption || "Bild");
      if (!info) {
        heights.push(42);
      } else {
        const frameHeight = options.maxHeight || 150;
        let imageHeight = Math.min(frameHeight, info.height * Math.min(cellWidth / info.width, frameHeight / info.height, 1));
        let imageWidth = Math.min(cellWidth, info.width * imageHeight / info.height);
        if (options.minImageWidth && imageWidth < Math.min(options.minImageWidth, cellWidth)) {
          const boostedWidth = Math.min(options.minImageWidth, cellWidth);
          imageHeight = Math.min(frameHeight, info.height * boostedWidth / info.width);
        }
        heights.push(imageHeight + 34);
      }
    }
    return Math.max(...heights, 42) + 10;
  };
  const addPinClusters = (box, pins, planRef, pageNumber) => {
    if (!box || !pins.length) return;
    const items = pins
      .map((pin) => ({ pin, placement: reportPlacementForPlan(pin, planRef, pageNumber) }))
      .filter((item) => item.placement)
      .map((item) => ({ ...item, x: item.placement.x ?? item.pin.x, y: item.placement.y ?? item.pin.y }))
      .filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y))
      .sort((a, b) => (a.pin.number || 0) - (b.pin.number || 0));
    const placed = [];
    items.forEach((item) => {
      const nearCount = placed.filter((other) => Math.hypot((other.x - item.x) * 100, (other.y - item.y) * 100) < 3.2).length;
      placed.push({ x: item.x, y: item.y });
      const label = pinLabel(item.pin);
      const anchorX = box.x + item.x * box.width;
      const anchorY = box.y + item.y * box.height;
      const dx = item.x > 0.82 ? -38 : 10 + Math.min(nearCount, 3) * 12;
      const dy = -18 + (nearCount % 4) * 12;
      const labelX = Math.min(box.x + box.width - 34, Math.max(box.x + 3, anchorX + dx));
      const labelY = Math.min(box.y + box.height - 12, Math.max(box.y + 12, anchorY + dy));
      const labelWidth = Math.max(22, Math.min(34, label.length * 5 + 12));
      addOp({ type: "pin", text: label, anchorX, anchorY, labelX, labelY, labelWidth, cluster: false });
    });
  };

  newPage();
  const headerTop = y;
  const metaX = pageWidth - margin - 148;
  addRect(metaX, headerTop, 148, 58, { fill: "#f4f7fa", stroke: "#d8dee6", lineWidth: 0.8 });
  addOp({ type: "text", text: "Datum", x: metaX + 10, y: headerTop + 15, size: 7.8, font: "F2", color: "#52606d" });
  addOp({ type: "text", text: formatDate(protocolInspectionDateTime(p)) || "-", x: metaX + 54, y: headerTop + 15, size: 8, font: "F1", color: "#17212b" });
  addOp({ type: "text", text: "Protokoll", x: metaX + 10, y: headerTop + 33, size: 7.8, font: "F2", color: "#52606d" });
  addOp({ type: "text", text: p.id.slice(-8).toUpperCase(), x: metaX + 54, y: headerTop + 33, size: 8, font: "F1", color: "#17212b" });
  addTextLine("Kai BewehrungsCheck · LTH Bau", margin, 9.5, { bold: true, color: "#5b6773", gap: 6 });
  addTextLine("Bewehrungskontrolle / Bewehrungsabnahme", margin, 21.5, { bold: true, color: "#17212b", gap: 8 });
  addText("Örtliche, stichprobenartige Kontrolle der Bewehrung auf Grundlage der vorliegenden Ausführungs- und Bewehrungspläne. Die Betonagefreigabe erfolgt unter Berücksichtigung der dokumentierten Feststellungen und Auflagen.", { size: 9.6, color: "#52606d", maxWidth: contentWidth - 174 });
  y = Math.max(y, headerTop + 70);
  addRule(y + 4, "#1f4e79", 2.2);
  y += 18;
  addInfoGrid("Projektinformationen", [
    ["Projekt / Bauvorhaben", p.head.projectName],
    ["Abnahme", p.head.acceptanceTitle],
    ["Art der Abnahme", p.head.acceptanceType],
    ["Baustellenadresse", formatAddress(project?.address || p.head.siteAddress)],
    ["Auftraggeber", companyReportText(clientCompany, project?.client || "")],
    ["Prüfingenieur", inspectorReportText(projectInspector, project?.inspector || "")],
    ["Bauteil / Geschoss", `${p.head.component || ""} ${p.head.floor || ""}`.trim()],
    ["Bereich / Achsen", p.head.areaAxes]
  ], "Prüfung", [
    ["Datum / Uhrzeit", formatDate(protocolInspectionDateTime(p))],
    ["Prüfer / Abnehmender", ownPersonReportText(defaultInspectorPerson, p.result.inspectorName)],
    ["Ausführende Firma", companyReportText(contractorCompany, p.head.contractor)],
    ["Allgemeiner Planstand / Prüfstand", p.head.planDate],
    ["Protokoll", p.id.slice(-8).toUpperCase()]
  ]);

  addTableCard("Wetterdaten", [
    { key: "condition", title: "Wetter", weight: 1.4 },
    { key: "temperature", title: "Temperatur", weight: 1 },
    { key: "wind", title: "Wind", weight: 1 },
    { key: "precipitation", title: "Niederschlag", weight: 1 },
    { key: "humidity", title: "Luftfeuchte", weight: 1 }
  ], [{ condition: p.weather.condition || "-", temperature: p.weather.temperature || "-", wind: p.weather.wind || "-", precipitation: p.weather.precipitation || "-", humidity: p.weather.humidity || "-" }], { size: 8.2, minHeight: 74 });

  logPdfStep("section:overview:start", { count: normalizeOverviewPhotos(p.overviewPhotos || [], p.id).length });
  const overview = normalizeOverviewPhotos(p.overviewPhotos || [], p.id);
  const overviewItems = [];
  for (let index = 0; index < overview.length; index += 1) {
    const item = overview[index];
    try {
      const src = await reportPhotoDataUrl(item.photoId, { maxWidth: 1400, maxHeight: 1400, quality: 0.75, mimeType: "image/jpeg" });
      overviewItems.push({ src, caption: `${item.isCover ? "Titelbild · " : ""}Übersichtsfoto ${index + 1}${item.caption ? " · " + item.caption : ""}`, boldCaption: true });
    } catch (error) {
      const message = `Übersichtsfoto ${index + 1} konnte nicht eingebettet werden: ${error?.message || error}`;
      warnings.push(message);
      imageDebug.errors.push({ type: "overview", index: index + 1, photoId: item.photoId, message });
      logPdfStep("section:overview:image-error", { index: index + 1, photoId: item.photoId, message });
    }
  }
  const overviewGridOptions = { columns: 2, maxHeight: 205, minImageWidth: 150 };
  const overviewFirstRowHeight = overviewItems.length ? await estimateImageGridFirstRowHeight(overviewItems, overviewGridOptions) : 58;
  const overviewSectionNeed = 44 + overviewFirstRowHeight;
  if (y + overviewSectionNeed > pageHeight - bottom) newPage();
  addHeading("Übersichtsfotos Baustelle", { keepWith: overviewSectionNeed });
  if (!overview.length) addTextCard("Übersichtsfotos Baustelle", "Keine Übersichtsfotos zur Baustelle hinterlegt.", { minHeight: 58 });
  if (overviewItems.length) await addImageGrid(overviewItems, overviewGridOptions);

  ensure(88);
  const resultStart = y;
  const resultStyle = statusStyle(p.result.resultStatus);
  const resultOpStart = page.ops.length;
  y = resultStart + 42;
  addBadge(p.result.resultStatus || "offen", margin + 16, resultStart + 19, resultStyle);
  addText(resultClause(p.result.resultStatus) || "Ergebnis gemäß Auswahl dokumentiert.", { x: margin + 16, maxWidth: contentWidth - 32, size: 9.7, bold: true, blank: false });
  if (p.result.finalNote) addText(`Schlussbemerkung: ${polishedReportText(p.result.finalNote)}`, { x: margin + 16, maxWidth: contentWidth - 32, size: 8.9, blank: false });
  const resultEnd = Math.max(y + 14, resultStart + 84);
  addCardShell("Ergebnis", resultStart, resultEnd, { opStart: resultOpStart, accent: resultStyle.color || "#12663e", fill: resultStyle.fill, headerFill: "#f0faf4", stroke: resultStyle.stroke });
  y = resultEnd + pdfTheme.cardGap;

  addTableCard("Verwendete Planunterlagen", [
    { key: "number", title: "Plan-Nr.", weight: 0.9, bold: true },
    { key: "name", title: "Planbezeichnung", weight: 2.2 },
    { key: "status", title: "Status", weight: 0.9 },
    { key: "date", title: "Planstand", weight: 1 },
    { key: "index", title: "Index", weight: 0.7 },
    { key: "pages", title: "Seite(n)", weight: 0.7 },
    { key: "file", title: "Datei", weight: 1.5 }
  ], reportPlans.map((plan) => ({ number: displayPlanNumber(plan) || "-", name: plan.appPlanName || plan.planName || plan.fileName || "Plan", status: plan.documentStatus || plan.planStatus || plan.status || "verwendet", date: plan.planDate || "-", index: plan.planIndex || "-", pages: String(plan.pageCount || 1), file: plan.fileName || plan.dropboxFileName || "" })), { emptyText: "Es wurden keine Planunterlagen hochgeladen.", size: 7.3, minHeight: 86 });

  addHeading("Auflagen / Mängel", { keepWith: issues.length ? 150 : 95 });
  if (!issues.length) {
    addTextCard("Auflagen / Mängel", "Keine Auflagen / Mängel dokumentiert.", { minHeight: 58 });
  } else {
    issues.forEach((issue, index) => {
      const sample = issue.sample || {};
      const pin = sample.pinId ? p.pins.find((item) => item.id === sample.pinId) : null;
      const placement = pin ? pinPlacements(pin)[0] : null;
      const plan = placement?.planId ? findReportPlan(reportPlans, reportPinPlacementReference(pin, placement)) : null;
      const status = sample.overlapCheck?.resultStatus || sample.status || "-";
      const style = statusStyle(status);
      ensure(98);
      const issueY = y;
      const opStart = page.ops.length;
      const issueTitle = `${index + 1}. ${issue.check?.title || "Prüfstelle"}${sample.number ? " · Prüfstelle " + sample.number : ""}${sample.location ? " · " + sample.location : ""}`;
      const issueTitleLines = splitLines(issueTitle, contentWidth - 28, 8.9).slice(0, 3);
      const issueHeaderHeight = Math.max(32, issueTitleLines.length * lineHeight(8.9) + 13);
      y = issueY + issueHeaderHeight + 8;
      addKeyValue("Status", status, { x: margin + 14, width: contentWidth - 28, keyWidth: 72, size: 8.2, rowFill: "#fbfcfd" });
      const pinText = pin ? `${pinLabel(pin)}${plan ? " · " + (displayPlanNumber(plan) || plan.fileName || "Plan") : ""}${placement?.pageNumber ? " / S." + placement.pageNumber : ""}` : "-";
      addKeyValue("Pin / Plan", pinText, { x: margin + 14, width: contentWidth - 28, keyWidth: 72, size: 8.1 });
      addKeyValue("Bemerkung", polishedReportText(sample.note || sample.overlapCheck?.generatedText || "") || "-", { x: margin + 14, width: contentWidth - 28, keyWidth: 72, size: 8.2, stack: true, rowFill: "#fbfcfd" });
      const issueEnd = Math.max(y + 12, issueY + issueHeaderHeight + 70);
      page.ops.splice(opStart, 0,
        { type: "rect", x: margin, y: issueY, width: contentWidth, height: issueEnd - issueY, fill: "#ffffff", stroke: style.stroke, lineWidth: 0.8 },
        { type: "rect", x: margin, y: issueY, width: contentWidth, height: issueHeaderHeight, fill: style.fill, stroke: style.stroke, lineWidth: 0.55 },
        ...issueTitleLines.map((line, lineIndex) => ({ type: "text", text: line, x: margin + 14, y: issueY + 16 + lineIndex * lineHeight(8.9), size: 8.9, font: "F2", color: "#17212b" }))
      );
      y = issueEnd + 10;
    });
  }

  addHeading("Checkliste und Prüfstellen", { keepWith: 155 });
  p.checkpoints.forEach((check) => {
    const samples = check.samples || [];
    const statusClass = resultClass(check.status);
    const compactEmptyCheck = !samples.length && (statusClass === "neutral" || statusClass === "na" || !check.status);
    const style = statusStyle(check.status);
    if (compactEmptyCheck) {
      ensure(28);
      const rowY = y;
      addRect(margin, rowY, contentWidth, 24, { fill: "#ffffff", stroke: pdfTheme.border, lineWidth: 0.45 });
      splitLines(check.title, contentWidth - 128, 8.5).slice(0, 1).forEach((line) => addOp({ type: "text", text: line, x: margin + 10, y: rowY + 15, size: 8.5, font: "F1", color: pdfTheme.text }));
      addBadge(check.status || "offen", pageWidth - margin - 106, rowY + 15, style);
      y = rowY + 29;
      return;
    }

    ensure(78);
    const checkStart = y;
    const checkOpStart = page.ops.length;
    const checkTitleLines = splitLines(check.title, contentWidth - 28, 9.2).slice(0, 3);
    const checkHeaderHeight = Math.max(32, checkTitleLines.length * lineHeight(9.2) + 13);
    y = checkStart + checkHeaderHeight + 8;
    addKeyValue("Gesamtstatus", check.status || "offen / nicht bewertet", { x: margin + 14, width: contentWidth - 28, keyWidth: 88, size: 8.2, rowFill: "#fbfcfd" });
    if (!samples.length) {
      addText("Keine einzelnen Prüfstellen angelegt.", { size: 8.4, color: pdfTheme.muted, x: margin + 14, maxWidth: contentWidth - 28, blank: false });
    }
    const checkEnd = Math.max(y + 12, checkStart + checkHeaderHeight + 40);
    page.ops.splice(checkOpStart, 0,
      { type: "rect", x: margin, y: checkStart, width: contentWidth, height: checkEnd - checkStart, fill: "#ffffff", stroke: pdfTheme.borderStrong, lineWidth: 0.8 },
      { type: "rect", x: margin, y: checkStart, width: contentWidth, height: checkHeaderHeight, fill: pdfTheme.headerFill, stroke: pdfTheme.borderStrong, lineWidth: 0.65 },
      ...checkTitleLines.map((line, lineIndex) => ({ type: "text", text: line, x: margin + 14, y: checkStart + 17 + lineIndex * lineHeight(9.2), size: 9.2, font: "F2", color: "#17212b" }))
    );
    y = checkEnd + 8;

    samples.forEach((sample) => {
      ensure(104);
      const sampleStart = y;
      const sampleOpStart = page.ops.length;
      const sampleTitle = `Prüfstelle ${sample.number || ""}${sample.location ? " · " + sample.location : ""}`.trim();
      const sampleTitleLines = splitLines(sampleTitle, contentWidth - 52, 8.8).slice(0, 3);
      const sampleHeaderHeight = Math.max(30, sampleTitleLines.length * lineHeight(8.8) + 12);
      y = sampleStart + sampleHeaderHeight + 8;
      addKeyValue("Status", sample.status || "offen / nicht bewertet", { x: margin + 22, width: contentWidth - 44, keyWidth: 78, size: 8.1, rowFill: "#fbfcfd" });
      addKeyValue("Bereich", sample.location || "ohne Angabe", { x: margin + 22, width: contentWidth - 44, keyWidth: 78, size: 8.1 });
      if (sample.pinId) addKeyValue("Pin", pinName(sample.pinId), { x: margin + 22, width: contentWidth - 44, keyWidth: 78, size: 8.1, rowFill: "#fbfcfd" });
      if (sample.photos?.length) addKeyValue("Fotos", `${sample.photos.length} Foto(s)`, { x: margin + 22, width: contentWidth - 44, keyWidth: 78, size: 8.1 });
      addKeyValue("Bemerkung", polishedReportText(sample.note) || "-", { x: margin + 22, width: contentWidth - 44, keyWidth: 78, size: 8.1, stack: true, rowFill: "#fbfcfd" });
      if (sample.overlapCheck?.generatedText) addKeyValue("Übergreifung", sample.overlapCheck.generatedText, { x: margin + 22, width: contentWidth - 44, keyWidth: 78, size: 7.9, stack: true });
      const sampleEnd = Math.max(y + 10, sampleStart + sampleHeaderHeight + 66);
      page.ops.splice(sampleOpStart, 0,
        { type: "rect", x: margin + 10, y: sampleStart, width: contentWidth - 20, height: sampleEnd - sampleStart, fill: "#ffffff", stroke: "#e2e7ed", lineWidth: 0.65 },
        { type: "rect", x: margin + 10, y: sampleStart, width: contentWidth - 20, height: sampleHeaderHeight, fill: "#fbfcfd", stroke: "#e2e7ed", lineWidth: 0.55 },
        ...sampleTitleLines.map((line, lineIndex) => ({ type: "text", text: line, x: margin + 22, y: sampleStart + 16 + lineIndex * lineHeight(8.8), size: 8.8, font: "F2", color: "#17212b" }))
      );
      y = sampleEnd + 8;
    });
  });

  addHeading("Plananlagen / Planmarkierungen", { pageBreak: true, keepWith: 120 });
  const appendixPlans = reportPlans.filter((plan) => (p.pins || []).some((pin) => pinHasReportPlacement(pin, plan)));
  if (!appendixPlans.length) addText("Keine Planmarkierungen mit Pins dokumentiert.");
  let firstPlanAppendix = true;
  for (let planIndex = 0; planIndex < appendixPlans.length; planIndex += 1) {
    const plan = appendixPlans[planIndex];
    const pagesForPlan = reportPlanPagesForProtocol(p, plan);
    for (const pageNumber of pagesForPlan) {
      if (!firstPlanAppendix || y > pageHeight - bottom - 625) newPage();
      firstPlanAppendix = false;
      ensure(620);
      const appendixY = y;
      const appendixTitle = `Anlage ${planIndex + 1} - Plan ${displayPlanNumber(plan) || plan.fileName || ""} - Seite ${pageNumber}`;
      const appendixTitleLines = splitLines(appendixTitle, contentWidth - 24, 9.6).slice(0, 2);
      const appendixHeaderHeight = Math.max(31, appendixTitleLines.length * lineHeight(9.6) + 12);
      addRect(margin, appendixY, contentWidth, appendixHeaderHeight, { fill: pdfTheme.headerFill, stroke: pdfTheme.borderStrong, lineWidth: 0.65 });
      appendixTitleLines.forEach((line, lineIndex) => addOp({ type: "text", text: line, x: margin + 12, y: appendixY + 18 + lineIndex * lineHeight(9.6), size: 9.6, font: "F2", color: "#17212b" }));
      y = appendixY + appendixHeaderHeight + 7;
      addText(plan.planName || plan.fileName || "Plan", { size: 8.5, color: "#52606d", blank: false });
      y += 2;
      const image = state.reportPlanImages.get(`${plan.id}:${pageNumber}`);
      const imageError = state.reportPlanErrors?.get(`${plan.id}:${pageNumber}`) || plan.renderError || "Planbild konnte nicht geladen werden.";
      const pinsForPage = p.pins.filter((pin) => pinHasReportPlacement(pin, plan, pageNumber));
      const tableReserve = pinsForPage.length ? 46 : 18;
      const availablePlanHeight = Math.max(540, pageHeight - bottom - y - tableReserve);
      const box = image ? await addImage(image, "", { maxHeight: Math.min(720, availablePlanHeight), maxWidth: contentWidth, x: margin, allowPageBreak: false }) : null;
      if (!image) addText(imageError, { size: 8.4, color: "#9f2a25" });
      if (box) addRect(box.x - 4, box.y - 4, box.width + 8, box.height + 8, { fill: "", stroke: pdfTheme.borderStrong, lineWidth: 0.8 });
      addPinClusters(box, pinsForPage, plan, pageNumber);
      addTable([
        { key: "pin", title: "Pin", weight: 0.5, bold: true },
        { key: "title", title: "Titel / Bereich", weight: 1.8 },
        { key: "status", title: "Status", weight: 0.9 },
        { key: "note", title: "Bemerkung", weight: 2.4 }
      ], pinsForPage.map((pin) => ({ pin: pinLabel(pin), title: pin.title || "Pin", status: pin.status || "-", note: polishedReportText(pin.note) || "-" })), { emptyText: "Keine Pins auf dieser Seite.", size: 6.9, maxLines: 3 });
    }
  }

  addHeading("Fotodokumentation", { pageBreak: true, keepWith: 185 });
  const photoGroups = collectReportPhotoGroups(p);
  imageDebug.photoFound = photoGroups.reduce((sum, group) => sum + (group.photos?.length || 0), 0);
  logPdfStep("section:photos:start", { groups: photoGroups.length, photos: imageDebug.photoFound });
  if (!photoGroups.length) addText("Keine Fotos hinterlegt.");
  for (const group of photoGroups) {
    ensure(92);
    const groupStart = y;
    const groupOpStart = page.ops.length;
    const groupTitleLines = splitLines(group.title, contentWidth - 28, 9.2).slice(0, 3);
    const groupHeaderHeight = Math.max(32, groupTitleLines.length * lineHeight(9.2) + 13);
    y = groupStart + groupHeaderHeight + 8;
    if (group.status) addKeyValue("Status", group.status, { x: margin + 14, width: contentWidth - 28, keyWidth: 72, size: 8.1, rowFill: "#fbfcfd" });
    if (group.meta) addKeyValue("Zuordnung", group.meta, { x: margin + 14, width: contentWidth - 28, keyWidth: 72, size: 8.1 });
    if (group.note) addKeyValue("Bemerkung", polishedReportText(group.note), { x: margin + 14, width: contentWidth - 28, keyWidth: 72, size: 8.1, stack: true, rowFill: "#fbfcfd" });
    const groupEnd = Math.max(y + 10, groupStart + groupHeaderHeight + 34);
    page.ops.splice(groupOpStart, 0,
      { type: "rect", x: margin, y: groupStart, width: contentWidth, height: groupEnd - groupStart, fill: "#ffffff", stroke: pdfTheme.borderStrong, lineWidth: 0.8 },
      { type: "rect", x: margin, y: groupStart, width: contentWidth, height: groupHeaderHeight, fill: pdfTheme.headerFill, stroke: pdfTheme.borderStrong, lineWidth: 0.55 },
      ...groupTitleLines.map((line, lineIndex) => ({ type: "text", text: line, x: margin + 14, y: groupStart + 17 + lineIndex * lineHeight(9.2), size: 9.2, font: "F2", color: "#17212b" }))
    );
    y = groupEnd + 8;
    const photoItems = [];
    for (const item of group.photos) {
      try {
        const src = await reportPhotoDataUrl(item.photo.id, { maxWidth: 1600, maxHeight: 1600, quality: 0.78, mimeType: "image/jpeg" });
        photoItems.push({ src, caption: `${item.label} · ${item.photo.name || "Foto"}` });
      } catch (error) {
        const message = `${group.title} / ${item.label} konnte nicht eingebettet werden: ${error?.message || error}`;
        warnings.push(message);
        imageDebug.errors.push({ type: "photo", group: group.title, photoId: item.photo?.id, message });
        logPdfStep("section:photos:image-error", { group: group.title, photoId: item.photo?.id, message });
      }
    }
    if (photoItems.length) await addImageGrid(photoItems, { columns: 1, maxHeight: 360, minImageWidth: 260 });
  }

  addHeading("Schlussformulierung", { keepWith: 90 });
  const closingRows = [
    ["Prüfer / Abnehmender", ownPersonReportText(defaultInspectorPerson, p.result.inspectorName)],
    ...(hasDrawnSignatures(p) ? [] : [["Unterschrift als Text", p.result.signatureText]])
  ];
  const closingEnd = addInfoCard("Abschluss", closingRows, margin, y, contentWidth);
  y = closingEnd + pdfTheme.cardGap;

  addHeading("Unterschriften / Kenntnisnahme", { keepWith: 190 });
  addText("Die Unterschrift bestätigt die Kenntnisnahme der dokumentierten Feststellungen, Auflagen und des Ergebnisses der Bewehrungskontrolle. Sie ersetzt keine gesonderten vertraglichen oder öffentlich-rechtlichen Erklärungen.", { size: 8.5, color: "#52606d" });
  const signatures = p.signatures || [];
  imageDebug.signaturesFound = signatures.filter((signature) => !!signatureSource(signature)).length;
  imageDebug.signatureFields = signatures.map((signature) => ({ name: signature.name || "", field: signatureFieldName(signature) || "none" }));
  if (!signatures.length) addText("Keine digitale Unterschrift erfasst.");
  for (const signature of signatures) {
    ensure(180);
    const blockY = y;
    const sigOpStart = page.ops.length;
    const titleLines = splitLines(signature.name || "ohne Name", contentWidth - 28, 9.2).slice(0, 3);
    const headerHeight = Math.max(30, titleLines.length * lineHeight(9.2) + 12);
    y = blockY + headerHeight + 8;
    addKeyValue("Firma", signature.company || "-", { x: margin + 14, width: contentWidth - 28, keyWidth: 82, size: 8.1, rowFill: "#fbfcfd" });
    addKeyValue("Funktion", signature.role || "-", { x: margin + 14, width: contentWidth - 28, keyWidth: 82, size: 8.1 });
    addKeyValue("Datum", formatDate(signature.signedAt) || "-", { x: margin + 14, width: contentWidth - 28, keyWidth: 82, size: 8.1, rowFill: "#fbfcfd" });
    if (signature.note) addKeyValue("Bemerkung", polishedReportText(signature.note), { x: margin + 14, width: contentWidth - 28, keyWidth: 82, size: 8.0, stack: true });
    const boxWidth = 286;
    const boxHeight = 76;
    const boxX = margin + 14;
    const boxY = y + 8;
    addRect(boxX, boxY, boxWidth, boxHeight, { fill: "#ffffff", stroke: "#25313d", lineWidth: 0.65 });
    addOp({ type: "line", x1: boxX + 14, y1: boxY + boxHeight - 14, x2: boxX + boxWidth - 14, y2: boxY + boxHeight - 14, color: "#25313d", width: 0.5 });
    const sourceField = signatureFieldName(signature);
    const source = signatureSource(signature);
    if (source) {
      const preparedSignature = await prepareSignatureImageForPdf(source);
      const info = await pdfImageInfo(preparedSignature || source, "Unterschrift");
      if (info) {
        const imageIndex = images.push(info) - 1;
        const signScale = Math.min((boxWidth - 30) / info.width, (boxHeight - 28) / info.height, 1);
        const signWidth = info.width * signScale;
        const signHeight = info.height * signScale;
        const signX = boxX + (boxWidth - signWidth) / 2;
        const signY = boxY + 10 + ((boxHeight - 30 - signHeight) / 2);
        addOp({ type: "image", imageIndex, x: signX, y: signY, width: signWidth, height: signHeight });
        imageDebug.signaturesEmbedded += 1;
      } else {
        const message = `Unterschrift ${signature.name || "ohne Name"} konnte nicht eingebettet werden.`;
        warnings.push(message);
        imageDebug.errors.push({ type: "signature", name: signature.name || "", field: sourceField || "none", message });
        addOp({ type: "text", text: "Keine gezeichnete Signatur gespeichert.", x: boxX + 10, y: boxY + 24, size: 8.2, font: "F1", color: "#697586" });
      }
    } else {
      imageDebug.errors.push({ type: "signature", name: signature.name || "", field: "none", message: "Keine gespeicherten Signaturdaten gefunden." });
      addOp({ type: "text", text: "Keine gezeichnete Signatur gespeichert.", x: boxX + 10, y: boxY + 24, size: 8.2, font: "F1", color: "#697586" });
    }
    const blockEnd = boxY + boxHeight + 12;
    page.ops.splice(sigOpStart, 0,
      { type: "rect", x: margin, y: blockY, width: contentWidth, height: blockEnd - blockY, fill: "#ffffff", stroke: "#d8dee6", lineWidth: 0.8 },
      { type: "rect", x: margin, y: blockY, width: contentWidth, height: headerHeight, fill: pdfTheme.headerFill, stroke: pdfTheme.borderStrong, lineWidth: 0.6 },
      ...titleLines.map((line, lineIndex) => ({ type: "text", text: line, x: margin + 14, y: blockY + 16 + lineIndex * lineHeight(9.2), size: 9.2, font: "F2", color: "#17212b" }))
    );
    y = blockEnd + 10;
  }
  if (warnings.length) {
    newPage();
    addHeading("Hinweise zur PDF-Erstellung");
    addText("PDF wurde erstellt, aber einzelne Bilder konnten nicht eingebettet werden.", { size: 10, bold: true, color: "#9f2a25" });
    warnings.forEach((warning) => addText(`- ${warning}`, { size: 9 }));
  }
  return { pages, images, warnings, totalPages: pages.length, imageDebug };
}

function buildPdfBlobFromModel(model) {
  const encoder = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let byteOffset = 0;
  const add = (part) => {
    const bytes = typeof part === "string" ? encoder.encode(part) : part;
    parts.push(bytes);
    byteOffset += bytes.length;
  };
  const addObject = (id, bodyParts) => {
    offsets[id] = byteOffset;
    add(`${id} 0 obj\n`);
    bodyParts.forEach(add);
    add("\nendobj\n");
  };
  const pageCount = model.pages.length;
  const pageIds = Array.from({ length: pageCount }, (_, index) => 5 + index);
  const contentIds = Array.from({ length: pageCount }, (_, index) => 5 + pageCount + index);
  const imageIds = model.images.map((_, index) => 5 + pageCount * 2 + index);
  const imageName = (index) => `Im${index + 1}`;
  const pageHeight = 841.89;
  const lineFor = (op) => {
    if (op.type === "text") return `BT\n/${op.font || "F1"} ${op.size || 10} Tf\n${pdfRgb(op.color)} rg\n1 0 0 1 ${op.x.toFixed(2)} ${(pageHeight - op.y).toFixed(2)} Tm\n${pdfHexText(op.text)} Tj\nET\n`;
    if (op.type === "rect") {
      const rectY = pageHeight - op.y - op.height;
      const width = op.lineWidth ?? 0.7;
      const hasFill = !!op.fill;
      const hasStroke = !!op.stroke;
      const fill = hasFill ? `${pdfRgb(op.fill)} rg\n` : "";
      const stroke = hasStroke ? `${pdfRgb(op.stroke)} RG\n${width} w\n` : "";
      const mode = hasFill && hasStroke ? "B" : hasFill ? "f" : "S";
      return `q\n${fill}${stroke}${op.x.toFixed(2)} ${rectY.toFixed(2)} ${op.width.toFixed(2)} ${op.height.toFixed(2)} re ${mode}\nQ\n`;
    }
    if (op.type === "line") return `q\n${pdfRgb(op.color)} RG\n${op.width || 0.8} w\n${op.x1.toFixed(2)} ${(pageHeight - op.y1).toFixed(2)} m ${op.x2.toFixed(2)} ${(pageHeight - op.y2).toFixed(2)} l S\nQ\n`;
    if (op.type === "image") return `q\n${op.width.toFixed(2)} 0 0 ${op.height.toFixed(2)} ${op.x.toFixed(2)} ${(pageHeight - op.y - op.height).toFixed(2)} cm\n/${imageName(op.imageIndex)} Do\nQ\n`;
    if (op.type === "pin") {
      const yAnchor = pageHeight - op.anchorY;
      const yLabel = pageHeight - op.labelY;
      const labelHeight = 15;
      const labelY = yLabel - labelHeight / 2;
      return `q\n0.12 0.16 0.20 RG\n0.7 w\n${op.anchorX.toFixed(2)} ${yAnchor.toFixed(2)} m ${op.labelX.toFixed(2)} ${yLabel.toFixed(2)} l S\n1 1 1 rg\n0.31 0.44 0.56 RG\n1 w\n${op.labelX.toFixed(2)} ${labelY.toFixed(2)} ${op.labelWidth.toFixed(2)} ${labelHeight} re B\nBT\n/F2 7.5 Tf\n0.12 0.16 0.20 rg\n1 0 0 1 ${(op.labelX + 4).toFixed(2)} ${(labelY + 5).toFixed(2)} Tm\n${pdfHexText(op.text)} Tj\nET\nQ\n`;
    }
    return "";
  };
  add("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  addObject(1, ["<< /Type /Catalog /Pages 2 0 R >>"]);
  addObject(2, [`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`]);
  addObject(3, ["<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"]);
  addObject(4, ["<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"]);
  model.pages.forEach((page, index) => {
    const xObjects = model.images.map((_, imageIndex) => `/${imageName(imageIndex)} ${imageIds[imageIndex]} 0 R`).join(" ");
    addObject(pageIds[index], [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << ${xObjects} >> /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentIds[index]} 0 R >>`]);
  });
  model.pages.forEach((page, index) => {
    const footer = { type: "text", text: `Seite ${index + 1} von ${pageCount}`, x: 270, y: 827, size: 8, font: "F1", color: "#697586" };
    const content = [...page.ops, footer].map(lineFor).join("");
    const contentBytes = encoder.encode(content);
    addObject(contentIds[index], [`<< /Length ${contentBytes.length} >>\nstream\n`, contentBytes, "\nendstream"]);
  });
  model.images.forEach((image, index) => {
    addObject(imageIds[index], [`<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n`, image.bytes, "\nendstream"]);
  });
  const xrefOffset = byteOffset;
  const size = 5 + pageCount * 2 + model.images.length;
  add(`xref\n0 ${size}\n0000000000 65535 f \n`);
  for (let id = 1; id < size; id += 1) add(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  add(`trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Blob(parts, { type: "application/pdf" });
}

async function createReportPdfBlob() {
  const debug = [];
  state.lastPdfExportDebug = debug;
  const logStep = (step, detail = {}) => {
    const entry = { step, ...detail };
    debug.push(entry);
    console.info("PDF-Export", entry);
  };
  try {
    if (!state.current) throw new Error("Keine Abnahme geöffnet.");
    logStep("start", { protocolId: state.current.id });
    saveFromForm();
    logStep("plan-images:start");
    await ensureReportPlanImages();
    logStep("plan-images:done", { count: state.reportPlanImages?.size || 0 });
    const parts = { fileName: reportFileName(state.current) };
    const model = await buildStructuredReportPdfModel(parts, logStep);
    state.lastPdfImageDebug = model.imageDebug || null;
    logStep("model:done", { pages: model.pages.length, images: model.images.length, warnings: model.warnings.length, imageDebug: model.imageDebug || null });
    if (!model.pages.length) throw new Error("PDF konnte nicht erzeugt werden, Bericht enthält keine Seiten.");
    const blob = buildPdfBlobFromModel(model);
    if (!blob || blob.type !== "application/pdf" || blob.size < 1000) throw new Error("PDF-Blob ist leer oder ungültig.");
    logStep("blob:done", { size: blob.size, type: blob.type });
    return { blob, fileName: sanitizeFileName(parts.fileName || reportFileName(state.current)), totalPages: model.totalPages, warnings: model.warnings, debug, parts };
  } catch (error) {
    logStep("error", { message: error?.message || String(error), stack: error?.stack || "" });
    console.error("PDF-Erzeugung fehlgeschlagen", { error, debug });
    throw new Error(`PDF konnte nicht erstellt werden. Bitte Druckdialog als Fallback nutzen. Ursache: ${error?.message || "unbekannt"}`);
  }
}

function triggerPdfDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = sanitizeFileName(fileName || reportFileName(state.current));
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function downloadReportPdf() {
  try {
    const { blob, fileName, warnings } = await createReportPdfBlob();
    triggerPdfDownload(blob, fileName);
    if (warnings?.length) alert("PDF wurde erstellt, aber einzelne Bilder konnten nicht eingebettet werden.");
  } catch (error) {
    console.error(error);
    alert(error?.message || "PDF konnte nicht erstellt werden. Bitte Druckdialog als Fallback nutzen.");
  }
}

async function shareReportPdf() {
  const debug = [];
  state.lastPdfShareDebug = debug;
  const addDebug = (step, detail = {}) => {
    const entry = { step, ...detail };
    debug.push(entry);
    console.info("PDF-Share", entry);
  };
  let result;
  try {
    addDebug("pdf:start");
    result = await createReportPdfBlob();
    addDebug("pdf:done", { type: result.blob?.type, size: result.blob?.size, fileName: result.fileName });
  } catch (error) {
    addDebug("pdf:error", { name: error?.name || "Error", message: error?.message || String(error) });
    console.error("PDF-Share PDF-Erzeugung fehlgeschlagen", { error, debug });
    alert(error?.message || "PDF konnte nicht erstellt werden. Bitte Druckdialog als Fallback nutzen.");
    return;
  }
  const { blob, fileName, warnings } = result;
  const fallbackDownload = (message) => {
    addDebug("fallback:download", { message });
    triggerPdfDownload(blob, fileName);
    alert(message || "Direktes Teilen wird auf diesem Gerät nicht unterstützt. Die PDF wurde heruntergeladen.");
  };
  try {
    if (!blob || blob.type !== "application/pdf") throw new Error(`Ungültiger PDF-Blob: ${blob?.type || "kein Typ"}`);
    if (typeof File === "undefined") {
      fallbackDownload("Direktes Teilen wird auf diesem Gerät nicht unterstützt. Die PDF wurde heruntergeladen.");
      return;
    }
    const safeName = sanitizeFileName(fileName || reportFileName(state.current));
    const file = new File([blob], safeName, { type: "application/pdf" });
    const text = buildReportShareText();
    const title = reportShareTitle();
    const hasShare = !!navigator.share;
    const hasCanShare = !!navigator.canShare;
    const canShareFiles = hasShare && hasCanShare ? navigator.canShare({ files: [file] }) : false;
    addDebug("share:capabilities", { hasShare, hasCanShare, canShareFiles, fileName: safeName, fileType: file.type, fileSize: file.size });
    if (!canShareFiles) {
      fallbackDownload("Direktes Teilen wird auf diesem Gerät nicht unterstützt. Die PDF wurde heruntergeladen.");
      return;
    }
    addDebug("share:start");
    await navigator.share({ title, text, files: [file] });
    addDebug("share:done");
    if (warnings?.length) alert("PDF wurde geteilt, aber einzelne Bilder konnten nicht eingebettet werden.");
  } catch (error) {
    if (error?.name === "AbortError") {
      addDebug("share:abort", { name: error.name, message: error.message || "" });
      return;
    }
    addDebug("share:error", { name: error?.name || "Error", message: error?.message || String(error) });
    console.error("Direkt-PDF-Share fehlgeschlagen", { error, debug });
    fallbackDownload("Direktes Teilen wird auf diesem Gerät nicht unterstützt. Die PDF wurde heruntergeladen.");
  }
}
async function saveReportPdfDirectExperimental() {
  return downloadReportPdf();
}

function saveReportPdf() {
  return downloadReportPdf();
}
function hasAddressContent(address) {
  const item = normalizeAddress(address);
  return !!(item.street || item.zip || item.city || (item.country && item.country !== "Deutschland"));
}

function masterDataWarnings(masterData) {
  const warnings = [];
  const logPdfStep = typeof logStep === "function" ? logStep : () => {};
  masterData.companies.forEach((company, index) => {
    const hasContent = !!(company.role || company.contact || company.phone || company.email || company.note || hasAddressContent(company.address));
    if (!company.name && hasContent) warnings.push(`Firma ${index + 1}: Firmenname fehlt.`);
  });
  [
    ...masterData.companies.map((item) => ["Firma", item.name, item.address]),
    ...masterData.inspectors.map((item) => ["Prüfer", item.office ? `${item.name || ""} / Sachbearbeiter ${item.office}` : (item.name || item.office), item.address]),
    ...masterData.ownPersons.map((item) => ["Abnehmender", item.name || item.company, item.address])
  ].forEach(([type, label, address]) => {
    const zip = normalizeAddress(address).zip;
    if (zip && !/^\d{5}$/.test(zip)) warnings.push(`${type} ${label || ""}: PLZ "${zip}" prüfen.`);
  });
  return warnings;
}

function syncMasterDataFromDom() {
  const panel = $("#masterDataPanel");
  if (!panel) return normalizeMasterData(state.masterData);
  const master = normalizeMasterData(state.masterData);
  panel.querySelectorAll("[data-master-item]").forEach((card) => {
    const collection = card.dataset.masterItem;
    const item = master[collection]?.find((entry) => entry.id === card.dataset.masterId);
    if (!item) return;
    card.querySelectorAll("[data-master-field]").forEach((input) => {
      setPath(item, input.dataset.masterField, input.type === "checkbox" ? input.checked : input.value);
    });
  });
  panel.querySelectorAll("[data-lookup-key]").forEach((input) => {
    const key = input.dataset.lookupKey;
    const index = Number(input.dataset.lookupIndex);
    if (Array.isArray(master[key])) master[key][index] = input.value;
  });
  state.masterData = normalizeMasterData(master);
  return state.masterData;
}

function handleMasterDataInput(event) {
  if (event.target.matches("[data-master-setting]")) {
    const key = event.target.dataset.masterSetting;
    state.settings[key] = event.target.value;
    persist();
    updateMasterDataSaveStatus("Planablage gespeichert");
    return true;
  }
  if (event.target.matches("[data-master-field]")) {
    const card = event.target.closest("[data-master-item]");
    const collection = card.dataset.masterItem;
    const item = state.masterData?.[collection]?.find((entry) => entry.id === card.dataset.masterId);
    if (!item) return true;
    const field = event.target.dataset.masterField;
    setPath(item, field, event.target.type === "checkbox" ? event.target.checked : event.target.value);
    if (collection === "ownPersons" && field === "isDefault" && item[field]) {
      state.masterData.ownPersons.forEach((person) => { if (person.id !== item.id) person.isDefault = false; });
    }
    setMasterDataDirty(true);
    renderDatalists();
    return true;
  }
  if (event.target.matches("[data-lookup-key]")) {
    const key = event.target.dataset.lookupKey;
    state.masterData[key][Number(event.target.dataset.lookupIndex)] = event.target.value;
    setMasterDataDirty(true);
    renderDatalists();
    return true;
  }
  return false;
}

async function saveMasterData({ alertSuccess = true } = {}) {
  try {
    syncMasterDataFromDom();
    const payload = normalizeMasterData({
      ...state.masterData,
      lastSavedAt: new Date().toISOString()
    });
    const warnings = masterDataWarnings(payload);
    await idbPutComplete("masterData", payload);
    const saved = await idbGet("masterData", "app");
    if (!saved?.id) throw new Error("Stammdaten konnten nach dem Schreiben nicht gelesen werden.");
    state.masterData = normalizeMasterData(saved);
    renderDatalists();
    setMasterDataDirty(false);
    renderMasterData();
    updateMasterDataSaveStatus("Alle Stammdaten gespeichert");
    showStorageWarning(warnings.length ? `Stammdaten gespeichert, bitte prüfen: ${warnings.join(" ")}` : "");
    if (alertSuccess) alert(`Alle Stammdaten gespeichert${warnings.length ? `\n\nHinweis: ${warnings.join(" ")}` : ""}`);
    return true;
  } catch (error) {
    console.error("Stammdaten speichern fehlgeschlagen", error);
    const message = error?.message || "Unbekannter IndexedDB-Fehler.";
    showStorageWarning(`Stammdaten konnten nicht gespeichert werden: ${message}`);
    alert(`Stammdaten konnten nicht gespeichert werden.\n${message}`);
    return false;
  }
}

function reportExportMetrics(reportElement) {
  const rect = reportElement.getBoundingClientRect();
  const tables = Array.from(reportElement.querySelectorAll("table"));
  const plans = Array.from(reportElement.querySelectorAll(".plan, .report-plan-image"));
  const sections = Array.from(reportElement.querySelectorAll("h2, .check-card, .appendix-block, .photo-group, .signature-report"));
  const maxTableWidth = tables.reduce((max, item) => Math.max(max, item.getBoundingClientRect().width), 0);
  const maxPlanWidth = plans.reduce((max, item) => Math.max(max, item.getBoundingClientRect().width), 0);
  return {
    offsetWidth: reportElement.offsetWidth,
    scrollWidth: reportElement.scrollWidth,
    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    sections: sections.length,
    planImages: reportElement.querySelectorAll(".plan img, .report-plan-image").length,
    tables: tables.length,
    maxTableWidth,
    maxPlanWidth
  };
}

function createPdfExportHost(parts) {
  const host = document.createElement("div");
  host.className = "pdf-export-host";
  Object.assign(host.style, {
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    minHeight: "100%",
    zIndex: "2147483646",
    overflow: "auto",
    background: "#ffffff",
    pointerEvents: "none",
    transform: "none",
    opacity: "1"
  });
  host.innerHTML = `<style>${parts.css}</style>${parts.body}`;
  const reportElement = host.querySelector(".report-export");
  if (reportElement) {
    reportElement.style.width = "190mm";
    reportElement.style.maxWidth = "190mm";
    reportElement.style.margin = "0 auto";
    reportElement.style.boxSizing = "border-box";
    reportElement.style.background = "#ffffff";
    reportElement.style.transform = "none";
    reportElement.style.overflow = "visible";
  }
  return { host, reportElement };
}

async function waitForReportReady(reportElement) {
  if (!reportElement) return;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  if (document.fonts?.ready) await document.fonts.ready.catch(() => {});
  const images = Array.from(reportElement.querySelectorAll("img"));
  await Promise.all(images.map((img) => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise((resolve) => {
      const done = () => resolve();
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
      window.setTimeout(done, 4000);
    });
  }));
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

function validateReportElement(reportElement) {
  if (!reportElement || !reportElement.matches(".report-export")) {
    throw new Error("PDF konnte nicht erzeugt werden, Bericht enthält keine exportierbaren Inhalte.");
  }
  const textLength = (reportElement.innerText || "").trim().length;
  if (textLength < 100 || !reportElement.querySelector(".report-header") || !reportElement.querySelector(".result-box")) {
    throw new Error("PDF konnte nicht erzeugt werden, Bericht enthält keine exportierbaren Inhalte.");
  }
}

function reportFileName(p) {
  const parts = [
    "Bewehrungsabnahme",
    p.head.projectName,
    p.head.acceptanceTitle,
    p.head.component || p.head.areaAxes,
    (p.head.createdAt || new Date().toISOString()).slice(0, 10)
  ].filter(Boolean);
  const name = parts.join("_")
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${name || "Bewehrungsabnahme"}.pdf`;
}

function sampleIssues(protocol) {
  const followup = isFollowupProtocol(protocol);
  return protocol.checkpoints.flatMap((check) =>
    (check.samples || [])
      .filter((sample) => followup ? isOpenFollowupStatus(sample.followupStatus || sample.status) : isInitialOpenSample(sample))
      .map((sample) => ({ check, sample }))
  );
}

function isFollowupProtocol(protocol = state.current) {
  return protocol?.type === "followup";
}

function initialSampleStatus(sample = {}) {
  return sample.overlapCheck?.resultStatus || sample.status || "";
}

function isInitialOpenStatus(status = "") {
  const value = String(status).toLowerCase();
  return !!(
    value.includes("mangel") ||
    value.includes("auflage") ||
    value.includes("teilweise") ||
    value.includes("offen") ||
    value.includes("nicht prüfbar") ||
    value.includes("nicht pr")
  ) && !value.includes("nicht relevant");
}

function isInitialOpenSample(sample = {}) {
  if (!isInitialOpenStatus(initialSampleStatus(sample))) return false;
  return !!(sample.location || sample.note || sample.pinId || sample.photos?.length || sample.overlapCheck);
}

function isOpenFollowupStatus(status = "") {
  const value = String(status).toLowerCase();
  return value.includes("teilweise") || value.includes("weiterhin") || value.includes("offen") || value.includes("nicht prüfbar") || value.includes("nicht pr") || value.includes("neu hinzugekommen");
}

function followupSourceLabel(protocol) {
  const source = state.protocols.find((item) => item.id === protocol?.parentProtocolId);
  if (!source) return protocol?.parentProtocolId ? `Abnahme ${protocol.parentProtocolId.slice(-8).toUpperCase()}` : "ohne Bezug";
  return `${acceptanceLabel(source)} vom ${formatDate(source.head?.createdAt || source.createdAt)}`;
}

function issuesReport(issues) {
  if (!issues.length) return `<p>Keine Auflagen / Mängel dokumentiert.</p>`;
  return `<section class="compact-summary"><p class="muted">Kurzübersicht. Die ausführliche Feststellung mit Bemerkung und Fotos steht direkt bei der Planmarkierung.</p><ol class="issues-list">
    ${issues.map((issue) => {
      const followup = !!(issue.sample.sourceStatus || issue.sample.followupStatus);
      const status = followup ? (issue.sample.followupStatus || issue.sample.status) : (issue.sample.overlapCheck?.resultStatus || issue.sample.status);
      const pin = issue.sample.pinId ? pinName(issue.sample.pinId) : "ohne Pin";
      return `<li><strong>${escapeHtml(pin)}</strong> - ${statusBadge(status)} ${escapeHtml(issue.check.title)}${issue.sample.location ? " - " + escapeHtml(issue.sample.location) : ""}</li>`;
    }).join("")}
  </ol></section>`;
}

function checklistReport(protocol) {
  const followup = isFollowupProtocol(protocol);
  const checks = protocol.checkpoints.filter(shouldIncludeCheckInReport);
  if (!checks.length) {
    return followup
      ? `<p>Keine übernommenen offenen Punkte dokumentiert.</p>`
      : `<p>Keine Checkbereiche aktiviert oder dokumentiert.</p><p class="small">Nicht aufgeführte Prüfpunkte waren im Rahmen dieser Abnahme nicht aktiviert bzw. nicht dokumentiert.</p>`;
  }
  const counts = checks.reduce((acc, check) => {
    const status = check.status || "offen / nicht bewertet";
    if (status.includes("Mangel")) acc.bad += 1;
    else if (status.includes("Auflage") || status.includes("teilweise")) acc.partial += 1;
    else if (status.includes("Dokumentation")) acc.doc += 1;
    else if (status.includes("OK")) acc.ok += 1;
    else if (status.includes("nicht relevant")) acc.na += 1;
    else acc.open += 1;
    return acc;
  }, { bad: 0, partial: 0, doc: 0, ok: 0, na: 0, open: 0 });
  const documentedSamples = checks.reduce((sum, check) => sum + (check.samples || []).length, 0);
  const issueTitles = checks
    .filter((check) => (check.status || "").includes("Mangel") || (check.status || "").includes("Auflage") || (check.status || "").includes("teilweise"))
    .map((check) => check.title)
    .slice(0, 4);
  return `<section class="compact-summary compact-check-summary">
    <p><strong>${checks.length} Prüfumfang(e), ${documentedSamples} Prüfstelle(n).</strong> Mängel: ${counts.bad}, Auflagen/teilweise: ${counts.partial}, Dokumentation: ${counts.doc}, OK: ${counts.ok}, nicht relevant: ${counts.na}, offen: ${counts.open}.</p>
    ${issueTitles.length ? `<p class="small"><strong>Relevante Punkte:</strong> ${issueTitles.map(escapeHtml).join(" · ")}${checks.length > issueTitles.length ? " · weitere siehe Planmarkierungen" : ""}</p>` : `<p class="small">Details stehen kompakt direkt bei Planmarkierungen oder dokumentierten Punkten ohne Pin.</p>`}
  </section>`;
}

function followupNewPoints(protocol) {
  if (!isFollowupProtocol(protocol)) return [];
  return protocol.checkpoints.flatMap((check) => (check.samples || [])
    .filter((sample) => isNewFollowupSample(check, sample))
    .map((sample) => ({ check, sample })));
}

function followupNewPointsReport(protocol) {
  const items = followupNewPoints(protocol);
  if (!items.length) return `<p>Keine neu festgestellten Punkte in dieser Nachbegehung dokumentiert.</p>`;
  const grouped = new Map();
  items.forEach(({ check, sample }) => {
    if (!grouped.has(check.id)) grouped.set(check.id, { check, samples: [] });
    grouped.get(check.id).samples.push(sample);
  });
  return [...grouped.values()].map(({ check, samples }) => `
    <section class="check-card">
      <div class="check-head">
        <h3>${escapeHtml(check.title)}</h3>
        <span class="status-badge neutral">Neu</span>
      </div>
      ${samples.map((sample) => sampleReport(sample, check)).join("")}
    </section>
  `).join("");
}

function sampleReport(sample, check = null) {
  if (sample.sourceStatus || sample.followupStatus || isNewFollowupSample(check, sample)) return followupSampleReport(sample, check);
  return `
    <article class="sample-card">
      <div class="sample-title">
        <span>Prüfstelle ${sample.number}${sample.location ? " · " + escapeHtml(sample.location) : ""}</span>
        ${statusBadge(sample.status)}
      </div>
      <div class="sample-grid">
        <div>Bereich</div><div>${escapeHtml(sample.location || "ohne Angabe")}</div>
        <div>Bemerkung</div><div>${escapeHtml(polishedReportText(sample.note) || "keine")}</div>
        <div>Pin</div><div>${escapeHtml(pinName(sample.pinId) || "kein Pin")}</div>
        <div>Fotos</div><div>${sample.photos?.length ? `${sample.photos.length} Foto(s)` : "keine"}</div>
      </div>
      ${overlapPdfRows(sample)}
    </article>
  `;
}

function followupSampleReport(sample, check = null) {
  const isNew = isNewFollowupSample(check, sample);
  const newNote = sample.followupNote || sample.note || "keine neue Bemerkung";
  return `
    <article class="sample-card">
      <div class="sample-title">
        <span>${isNew ? "Neu festgestellt" : "Nachkontrolle"} ${sample.number}${sample.location ? " · " + escapeHtml(sample.location) : ""}</span>
        ${statusBadge(sample.followupStatus || sample.status || (isNew ? "neu hinzugekommen" : "weiterhin offen"))}
      </div>
      <div class="sample-grid">
        <div>Bereich</div><div>${escapeHtml(sample.location || "ohne Angabe")}</div>
        ${isNew ? `<div>Einordnung</div><div>Neu festgestellt in Nachbegehung</div>` : `<div>Ursprünglicher Status</div><div>${statusBadge(sample.sourceStatus || "offen")}</div>
        <div>Ursprüngliche Bemerkung</div><div>${escapeHtml(polishedReportText(sample.sourceNote) || "keine")}</div>`}
        <div>Plan / Pin</div><div>${escapeHtml(pinName(sample.pinId) || pinName(sample.sourcePinId) || "kein Pin")}</div>
        <div>Status Nachbegehung</div><div>${statusBadge(sample.followupStatus || sample.status || "weiterhin offen")}</div>
        <div>Bemerkung Nachbegehung</div><div>${escapeHtml(polishedReportText(newNote))}</div>
        <div>Neue Fotos</div><div>${sample.photos?.length ? `${sample.photos.length} Foto(s)` : "keine"}</div>
        <div>Referenzfotos</div><div>${sample.referencePhotos?.length ? `${sample.referencePhotos.length} Foto(s)` : "keine"}</div>
      </div>
    </article>
  `;
}

function overlapPdfRows(sample) {
  if (!sample.overlapCheck) return "";
  const calc = calculateOverlap(sample.overlapCheck, sample);
  if (calc.mode === OVERLAP_PLAN_MODE) {
    return `
      <div class="calc-note">
        <strong>Übergreifungslängen-Prüfung · Sollwert laut Plan</strong><br>
        Planbezug: ${escapeHtml(pinName(sample.pinId) || "ohne Pin")} · Ø${escapeHtml(calc.diameterMm || "")} mm · Soll: ${escapeHtml(formatMmCm(calc.requiredFromPlanMm))} · Vorhanden: ${escapeHtml(formatMmCm(calc.measuredMm))} · Differenz: ${escapeHtml(formatDifference(calc.differenceMm))}<br>
        ${statusBadge(calc.resultStatus)} ${escapeHtml(calc.generatedText)}
      </div>
    `;
  }
  return `
    <div class="calc-note">
      <strong>Übergreifungslängen-Prüfung · Berechnung nach EC2/NA</strong><br>
      Ø${escapeHtml(calc.diameterMm)} mm · Beton ${escapeHtml(calc.concreteClass)} · ${escapeHtml(calc.steelGrade)} · ${escapeHtml(bondLabel(calc.bondCondition))} · Stoßanteil ${escapeHtml(spliceRatioLabel(calc.spliceRatio))}<br>
      Erforderlich: ${escapeHtml(formatMmCm(calc.requiredMm))} · Vorhanden: ${escapeHtml(formatMmCm(calc.measuredMm))} · Differenz: ${escapeHtml(formatDifference(calc.differenceMm))} ${statusBadge(calc.resultStatus)}<br>
      <span class="small">Hinweis: Maßgebend bleiben freigegebene Statik, Bewehrungsplan sowie DIN EN 1992-1-1 mit Nationalem Anhang.</span><br>
      ${escapeHtml(calc.generatedText)}
    </div>
  `;
}

async function ensureReportPlanImages() {
  state.reportPlanImages = new Map();
  state.reportPlanErrors = new Map();
  state.reportImageCache ||= new Map();
  for (const plan of reportPlansForProtocol(state.current)) {
    const pages = reportPlanPagesForProtocol(state.current, plan);
    if (plan.type === "missing" || plan.reportOnly) {
      pages.forEach((pageNumber) => state.reportPlanErrors.set(`${plan.id}:${pageNumber}`, plan.renderError || "Plan zum Pin konnte nicht aufgelöst werden."));
      continue;
    }
    if (plan.type === "application/pdf") {
      for (const pageNumber of pages) {
        try {
          const dataUrl = await renderPdfPageToDataUrl(plan, pageNumber);
          state.reportPlanImages.set(`${plan.id}:${pageNumber}`, await prepareImageForReport(dataUrl, { maxWidth: 2200, maxHeight: 2200, quality: 0.82, mimeType: "image/jpeg" }));
        } catch (error) {
          const message = `PDF konnte nicht gerendert werden. Plan: ${displayPlanNumber(plan) || plan.fileName || plan.id}, Seite ${pageNumber}. ${error?.message || ""}`.trim();
          state.reportPlanErrors.set(`${plan.id}:${pageNumber}`, message);
        }
      }
    } else {
      try {
        const record = await idbGet("plans", plan.id);
        if (record?.blob) {
          const dataUrl = await prepareImageForReport(record.blob, { maxWidth: 2200, maxHeight: 2200, quality: 0.82, mimeType: "image/jpeg" });
          pages.forEach((pageNumber) => state.reportPlanImages.set(`${plan.id}:${pageNumber}`, dataUrl));
        } else {
          pages.forEach((pageNumber) => state.reportPlanErrors.set(`${plan.id}:${pageNumber}`, `Planbild konnte nicht geladen werden. plan_id: ${plan.id}`));
        }
      } catch (error) {
        pages.forEach((pageNumber) => state.reportPlanErrors.set(`${plan.id}:${pageNumber}`, `Planbild konnte nicht geladen werden. ${error?.message || ""}`.trim()));
      }
    }
  }
}

function displayPlanNumber(plan) {
  return planPrimaryNumber(plan || {}) || safePlanNumberCandidate(plan?.planNumber || plan?.planNo || plan?.plan_number || "");
}
function planOverviewReport(p) {
  const plans = reportPlansForProtocol(p);
  if (!plans.length) return "<p>Es wurden keine Planunterlagen hochgeladen.</p>";
  return `<table>
    <thead><tr><th>Plan-Nr.</th><th>Planbezeichnung</th><th>Status</th><th>Planstand</th><th>Index</th><th>Seite(n)</th><th>Datei</th></tr></thead>
    <tbody>
      ${plans.map((plan) => `<tr>
        <td><strong>${escapeHtml(displayPlanNumber(plan) || "ohne Angabe")}</strong></td>
        <td>${escapeHtml(plan.appPlanName || plan.title || plan.fileName || "Plan")}${plan.remark ? `<br><span class="small">${escapeHtml(plan.remark)}</span>` : ""}${plan.renderError ? `<br><span class="report-warning small">${escapeHtml(plan.renderError)}</span>` : ""}</td>
        <td>${escapeHtml(plan.documentStatus || "verwendet")}</td>
        <td>${escapeHtml(plan.planDate || "ohne Angabe")}</td>
        <td>${escapeHtml(plan.planIndex || "ohne Angabe")}</td>
        <td>${escapeHtml(plan.pageCount || 1)}</td>
        <td><span class="small">${escapeHtml(plan.fileName || plan.dropboxFileName || "")}</span></td>
      </tr>`).join("")}
    </tbody>
  </table>`;
}
function reportPinCallouts(pins, planRef, pageNumber) {
  const items = pins
    .map((pin) => ({ pin, placement: reportPlacementForPlan(pin, planRef, pageNumber) }))
    .filter((item) => item.placement)
    .map((item) => ({ ...item, x: item.placement.x ?? item.pin.x, y: item.placement.y ?? item.pin.y }))
    .filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y))
    .sort((a, b) => (a.pin.number || 0) - (b.pin.number || 0));
  const placed = [];
  return items.map((item) => {
    const nearCount = placed.filter((other) => Math.hypot((other.x - item.x) * 100, (other.y - item.y) * 100) < 3.2).length;
    placed.push({ x: item.x, y: item.y });
    const statusClass = statusClassName(item.pin.status || "");
    const x = Math.min(0.985, Math.max(0.015, item.x));
    const y = Math.min(0.985, Math.max(0.015, item.y));
    const dx = x > 0.82 ? -34 : 8 + Math.min(nearCount, 3) * 11;
    const dy = -22 + (nearCount % 4) * 12;
    const line = Math.max(8, Math.hypot(dx, dy + 6));
    const angle = Math.atan2(dy + 6, dx) * 180 / Math.PI;
    return `<span class="pin-marker" style="left:${x * 100}%;top:${y * 100}%;--dx:${dx}px;--dy:${dy}px;--line:${line}px;--angle:${angle}deg"><span class="pin-point"></span><span class="pin-leader"></span><span class="pin-chip ${statusClass}">${escapeHtml(pinLabel(item.pin))}</span></span>`;
  }).join("");
}
function sampleShouldAppearInPlanFindings(sample = {}) {
  if (!sample) return false;
  if (sample.status === "nicht relevant" && !(sample.note || sample.photos?.length || sample.pinId)) return false;
  if (sample.status === "offen / nicht bewertet" && !(sample.note || sample.photos?.length || sample.pinId)) return false;
  return !!(sample.pinId || sample.note || sample.photos?.length || sample.overlapCheck || sample.status === "Dokumentation" || isInitialOpenSample(sample) || sample.followupStatus);
}

function reportFindingEntriesForPin(protocol, pin) {
  const entries = [];
  const used = new Set();
  (protocol.checkpoints || []).forEach((check) => {
    (check.samples || []).forEach((sample) => {
      if (sample.pinId !== pin.id && sample.sourcePinId !== pin.id) return;
      if (!sampleShouldAppearInPlanFindings(sample)) return;
      used.add(sample.id);
      entries.push({ check, sample, pin, status: sample.followupStatus || sample.overlapCheck?.resultStatus || sample.status || pin.status, title: check.title, location: sample.location || "", note: sample.followupNote || sample.note || sample.sourceNote || sample.overlapCheck?.generatedText || pin.note || "", photos: uniquePhotoRefs([...(sample.photos || []), ...(pin.photos || [])]) });
    });
  });
  if (!entries.length && (pin.note || pin.photos?.length || pin.title)) {
    entries.push({ check: null, sample: null, pin, status: pin.status || "Dokumentation", title: pin.title || "Planmarkierung", location: "", note: pin.note || "", photos: uniquePhotoRefs(pin.photos || []) });
  }
  return entries;
}

function uniquePhotoRefs(photos = []) {
  const seen = new Set();
  return (photos || []).filter((photo) => {
    if (!photo?.id || seen.has(photo.id)) return false;
    seen.add(photo.id);
    return true;
  });
}

async function reportFindingPhotosHtml(photos = []) {
  const items = [];
  for (const photo of uniquePhotoRefs(photos)) {
    const src = await reportPhotoDataUrl(photo.id, { maxWidth: 1600, maxHeight: 1600, quality: 0.78, mimeType: "image/jpeg" });
    if (src) items.push({ photo, src });
  }
  if (!items.length) return "";
  const gridClass = items.length === 1 ? "pin-photo-grid single" : "pin-photo-grid";
  return `<div class="${gridClass}">${items.map((item, index) => `<figure class="pin-photo"><img src="${item.src}" alt="${escapeAttr(item.photo.name || "Foto")}"><figcaption>Foto ${index + 1}${item.photo.name ? " · " + escapeHtml(item.photo.name) : ""}</figcaption>${barCountReportHtml(item.photo)}</figure>`).join("")}</div>`;
}

async function planFindingCardHtml(entry) {
  const pin = entry.pin;
  const pinText = pin ? pinLabel(pin) : "ohne Pin";
  const hasPhotos = !!(entry.photos || []).length;
  const rawStatus = entry.status || "Dokumentation";
  const displayStatus = rawStatus === "nicht relevant" && hasPhotos ? "Dokumentation / nicht relevant" : statusLabel(rawStatus);
  const badgeStatus = rawStatus === "nicht relevant" && hasPhotos ? "Dokumentation" : rawStatus;
  const photoHtml = await reportFindingPhotosHtml(entry.photos || []);
  return `<article class="pin-finding-card">
    <div class="pin-finding-head"><strong>${escapeHtml(pinText)} - ${escapeHtml(displayStatus)} - ${escapeHtml(entry.title || "Feststellung")}</strong>${statusBadge(badgeStatus || "Dokumentation")}</div>
    <div class="pin-finding-body">
      ${entry.location ? `<p><strong>Bereich:</strong> ${escapeHtml(entry.location)}</p>` : ""}
      ${entry.note ? `<p><strong>Bemerkung:</strong> ${escapeHtml(polishedReportText(entry.note))}</p>` : `<p class="muted">Keine Bemerkung erfasst.</p>`}
      ${entry.sample?.overlapCheck ? overlapPdfRows(entry.sample) : ""}
      ${photoHtml || `<p class="small">Keine Fotos zu dieser Feststellung hinterlegt.</p>`}
    </div>
  </article>`;
}

async function planAppendixReport(p) {
  const planSections = [];
  const plansWithPins = reportPlansForProtocol(p).filter((plan) => (p.pins || []).some((pin) => pinHasReportPlacement(pin, plan)));
  if (!plansWithPins.length) {
    const pinsWithPlanReference = (p.pins || []).filter((pin) => pinPlacements(pin).some((placement) => placement.planId));
    if (pinsWithPlanReference.length) {
      return `<section class="report-section"><h2>Planmarkierungen und Feststellungen</h2><p class="report-warning">Planmarkierungen sind vorhanden, aber die zugehörigen Planunterlagen konnten nicht aufgelöst werden.</p></section>`;
    }
    return `<section class="report-section"><h2>Planmarkierungen und Feststellungen</h2><p>Keine Planmarkierungen mit Pins dokumentiert.</p></section>`;
  }
  for (const [planIndex, plan] of plansWithPins.entries()) {
    const pages = reportPlanPagesForProtocol(p, plan);
    for (const pageNumber of pages) {
      const pins = (p.pins || []).filter((pin) => pinHasReportPlacement(pin, plan, pageNumber)).sort((a, b) => (a.number || 0) - (b.number || 0));
      if (!pins.length) continue;
      const image = state.reportPlanImages.get(`${plan.id}:${pageNumber}`);
      const imageError = state.reportPlanErrors?.get(`${plan.id}:${pageNumber}`) || plan.renderError || "Planbild nicht verfügbar.";
      const findingCards = [];
      for (const pin of pins) {
        const entries = reportFindingEntriesForPin(p, pin);
        for (const entry of entries) findingCards.push(await planFindingCardHtml(entry));
      }
      planSections.push(`
        <section class="appendix-block page-break">
          <h2>Anlage ${planIndex + 1} - Plan ${escapeHtml(displayPlanNumber(plan) || plan.fileName || plan.id)} - ${escapeHtml(plan.title || plan.appPlanName || "Plananlage")} - Seite ${pageNumber}</h2>
          ${image ? `<div class="plan"><img class="report-plan-image" src="${image}" alt="Plan">${reportPinCallouts(pins, plan, pageNumber)}</div>` : `<p class="report-warning">${escapeHtml(imageError)}</p>`}
          <div class="pin-finding-list">${findingCards.join("") || `<p class="muted">Pins vorhanden, aber keine zugeordneten Feststellungen mit Text/Fotos.</p>`}</div>
        </section>
      `);
    }
  }
  return planSections.join("");
}
async function unplacedFindingsReport(p) {
  const entries = [];
  (p.checkpoints || []).forEach((check) => (check.samples || []).forEach((sample) => {
    if (sample.pinId || sample.sourcePinId) return;
    const note = sample.followupNote || sample.note || sample.sourceNote || sample.overlapCheck?.generatedText || "";
    const photos = uniquePhotoRefs(sample.photos || []);
    if (!note && !photos.length) return;
    entries.push({ check, sample, pin: null, status: sample.followupStatus || sample.overlapCheck?.resultStatus || sample.status || check.status, title: check.title, location: sample.location || "", note, photos });
  }));
  if (!entries.length) return "";
  const cards = [];
  for (const entry of entries) cards.push(await planFindingCardHtml(entry));
  return `<section class="report-section unplaced-findings"><h2>Dokumentierte Punkte ohne Planmarkierung</h2><p class="muted">Diese Punkte haben keinen Pin und werden deshalb separat aufgeführt.</p><div class="pin-finding-list">${cards.join("")}</div></section>`;
}

async function overviewPhotoReport(p) {
  const photos = normalizeOverviewPhotos(p.overviewPhotos || [], p.id);
  if (!photos.length) return "<p>Keine Übersichtsfotos zur Baustelle hinterlegt.</p>";
  const items = [];
  for (const item of photos) {
    const record = await idbGet("photos", item.photoId);
    if (!record?.blob) continue;
    items.push({
      ...item,
      fileName: record.fileName || record.name || "Übersichtsfoto",
      src: await reportPhotoDataUrl(item.photoId, { maxWidth: 1400, maxHeight: 1400, quality: 0.75, mimeType: "image/jpeg" })
    });
  }
  if (!items.length) return "<p>Übersichtsfotos konnten nicht geladen werden.</p>";
  return `
    <div class="overview-report-grid">
      ${items.map((item, index) => `
        <figure class="overview-report-photo">
          <img src="${item.src}" alt="${escapeAttr(item.caption || item.fileName)}">
          <figcaption>
            <strong>${item.isCover ? "Titelbild · " : ""}Übersichtsfoto ${index + 1}</strong>
            ${escapeHtml(item.caption || item.fileName)}
          </figcaption>
        </figure>
      `).join("")}
    </div>
  `;
}

async function photoReport(p) {
  return "<p>Fotos werden im kompakten Bericht direkt bei der jeweiligen Planmarkierung/Feststellung ausgegeben.</p>";
}

function barCountReportHtml(photo) {
  const analysis = normalizeBarCountAnalysis(photo?.barCountAnalysis);
  if (!analysis) return "";
  const detected = analysis.detectedCount === "" ? "kein KI-Vorschlag erfasst" : `${analysis.detectedCount} Stäbe erkannt`;
  const confirmed = analysis.confirmedCount === "" ? "keine manuelle Bestätigung" : `${analysis.confirmedCount} Stäbe manuell bestätigt`;
  return `
    <p class="photo-analysis">
      Fotoanalyse: ${escapeHtml(detected)}, ${escapeHtml(confirmed)}.
      Die automatische Fotoauswertung dient als Assistenzfunktion und ersetzt keine fachliche Prüfung.
      ${analysis.note ? `<br>${escapeHtml(polishedReportText(analysis.note))}` : ""}
    </p>
  `;
}

function hasDrawnSignatures(p) {
  return !!(p?.signatures || []).some((signature) => !!signature.signatureData);
}

function signatureReport(p) {
  const signatures = p.signatures || [];
  const notice = "Die Unterschrift bestätigt die Kenntnisnahme der dokumentierten Feststellungen, Auflagen und des Ergebnisses der Bewehrungskontrolle. Sie ersetzt keine gesonderten vertraglichen oder öffentlich-rechtlichen Erklärungen.";
  if (!signatures.length) {
    return `<p>${escapeHtml(notice)}</p><p>Keine digitale Unterschrift erfasst.</p>`;
  }
  return `
    <p>${escapeHtml(notice)}</p>
    ${signatures.map((signature) => `
      <div class="signature-report">
        <table>
          <tbody>
            <tr><td>Name</td><td>${escapeHtml(signature.name || "")}</td></tr>
            <tr><td>Firma</td><td>${escapeHtml(signature.company || "")}</td></tr>
            <tr><td>Funktion</td><td>${escapeHtml(signature.role || "")}</td></tr>
            ${signature.category && signature.category !== signature.role ? `<tr><td>Unterschrift für</td><td>${escapeHtml(signature.category || "")}</td></tr>` : ""}
            <tr><td>Datum / Uhrzeit</td><td>${escapeHtml(formatDate(signature.signedAt))}</td></tr>
            ${signature.note ? `<tr><td>Bemerkung</td><td>${escapeHtml(polishedReportText(signature.note))}</td></tr>` : ""}
          </tbody>
        </table>
        ${signature.signatureData ? `<div class="signature-print-box"><img class="signature-image" src="${signature.signatureData}" alt="Unterschrift ${escapeAttr(signature.name || "")}"></div>` : `<div class="signature-empty">Keine Unterschriftsgrafik erfasst.</div>`}
      </div>
    `).join("")}
  `;
}

function weatherReport(p) {
  return `<table>
    <tbody>
      <tr><th>Ort / Zeitpunkt</th><td>${escapeHtml(p.weather.weatherLocation || "ohne Angabe")}<br>${escapeHtml(formatDate(p.weather.weatherDateTime))}</td><th>Temperatur / Zustand</th><td>${escapeHtml(p.weather.temperature || "ohne Angabe")}<br>${escapeHtml(p.weather.weatherCondition || "")}</td></tr>
      <tr><th>Niederschlag / Wind</th><td>${escapeHtml(p.weather.precipitation || "ohne Angabe")}<br>${escapeHtml(p.weather.wind || "")}</td><th>Luftfeuchtigkeit / Bedingungen</th><td>${escapeHtml(p.weather.humidity || "ohne Angabe")}<br>${escapeHtml(p.weather.siteConditions || "")}</td></tr>
    </tbody>
  </table>`;
}

function infoRow(label, value) {
  return `<div class="info-row"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value || "ohne Angabe").replace(/\n/g, "<br>")}</span></div>`;
}

function companyReportText(company, fallback = "") {
  if (!company) return fallback || "";
  return [company.name, formatAddress(company.address)].filter(Boolean).join("\n");
}

function inspectorReportText(inspector, fallback = "") {
  if (!inspector) return fallback || "";
  const firstLine = inspector.office ? `${inspector.name || "Prüfingenieur"} / Sachbearbeiter ${inspector.office}` : (inspector.name || "");
  return [firstLine, formatAddress(inspector.address)].filter(Boolean).join("\n");
}

function ownPersonReportText(person, fallback = "") {
  if (!person) return fallback || "";
  const firstLine = [person.name, person.company].filter(Boolean).join(" / ");
  return [firstLine, person.role, formatAddress(person.address)].filter(Boolean).join("\n");
}

function projectClientRecord(project) {
  return project?.clientSnapshot || snapshotCompany(resolveCompanyById(project?.clientId || "") || resolveCompany(project?.client || ""));
}

function projectContractorRecord(project, protocol = null) {
  const value = protocol?.head?.contractor || project?.contractor || "";
  return project?.contractorSnapshot || snapshotCompany(resolveCompanyById(project?.contractorId || "") || resolveCompany(value));
}

function projectInspectorRecord(project) {
  return project?.inspectorSnapshot || snapshotInspector(resolveInspectorById(project?.inspectorId || "") || resolveInspector(project?.inspector || ""));
}

function projectDefaultInspectorRecord(project, protocol = null) {
  const value = protocol?.result?.inspectorName || project?.defaultInspector || "";
  return project?.defaultInspectorPersonSnapshot || snapshotOwnPerson(resolveOwnPersonById(project?.defaultInspectorPersonId || "") || resolveOwnPerson(value));
}

function statusBadge(status = "offen / nicht bewertet") {
  return `<span class="status-badge ${statusClassName(status)}">${escapeHtml(statusLabel(status || "offen / nicht bewertet"))}</span>`;
}

function statusClassName(status = "") {
  if (status.includes("nicht OK") || status.includes("Nicht zur Betonage")) return "bad";
  if (status.includes("teilweise") || status.includes("Auflage") || status.includes("Nachkontrolle") || status.includes("weiterhin offen") || status.includes("nicht prüfbar")) return "partial";
  if (status.includes("OK") || status.includes("freigegeben") || status.includes("erledigt")) return "ok";
  if (status.includes("Dokumentation")) return "doc";
  return "neutral";
}

function resultClass(status = "") {
  if (status === "Nicht zur Betonage freigegeben" || status === "weiterhin wesentliche Mängel offen") return "bad";
  if (status === "Zur Betonage freigegeben unter Auflagen" || status === "Nachkontrolle erforderlich" || status === "teilweise erledigt, Rest offen" || status === "Nachkontrolle nicht abschließend möglich") return "partial";
  if (status === "Zur Betonage freigegeben" || status === "alle offenen Punkte erledigt") return "ok";
  return "neutral";
}

function box(label, value) {
  return `<div class="box"><strong>${label}</strong><br>${escapeHtml(value || "").replace(/\n/g, "<br>")}</div>`;
}

function resultClause(status) {
  if (status === "Zur Betonage freigegeben") {
    return "Aus Sicht der dokumentierten Bewehrungskontrolle bestehen gegen die Betonage keine Bedenken.";
  }
  if (status === "Zur Betonage freigegeben unter Auflagen") {
    return "Aus Sicht der Bewehrungskontrolle bestehen gegen die Betonage keine Bedenken, sofern die genannten Auflagen vor Betonage vollständig umgesetzt werden.";
  }
  if (status === "Nicht zur Betonage freigegeben") {
    return "Eine Betonagefreigabe kann derzeit nicht erfolgen. Die nachfolgend genannten Punkte sind vor einer erneuten Kontrolle vollständig nachzuarbeiten.";
  }
  if (status === "Nachkontrolle erforderlich") {
    return "Vor einer abschließenden Bewertung ist eine Nachkontrolle der dokumentierten Punkte erforderlich.";
  }
  if (status === "alle offenen Punkte erledigt") return "Die nachkontrollierten Punkte wurden als erledigt dokumentiert.";
  if (status === "teilweise erledigt, Rest offen") return "Ein Teil der offenen Punkte wurde erledigt; Restpunkte bleiben dokumentiert offen.";
  if (status === "weiterhin wesentliche Mängel offen") return "Wesentliche Mängel sind weiterhin offen und erfordern weitere Maßnahmen.";
  if (status === "Nachkontrolle nicht abschließend möglich") return "Die Nachkontrolle konnte nicht abschließend bewertet werden.";
  return "";
}

function pinName(id) {
  const pin = state.current.pins.find((item) => item.id === id);
  if (!pin) return "";
  const placement = pinPlacements(pin).find((item) => item.isPrimary) || pinPlacements(pin)[0];
  const plan = planById(placement?.planId || pin.planId);
  return `${pinLabel(pin)} · ${displayPlanNumber(plan) || plan?.fileName || "Plan"} / S.${placement?.pageNumber || pin.pageNumber || 1}`;
}

function pinContextLabel(pin) {
  if (!pin) return "Allgemeine Feststellung";
  const check = state.current?.checkpoints?.find((item) => item.id === pin.checkItemId || item.samples?.some((sample) => sample.id === pin.sampleId));
  const sample = check?.samples?.find((item) => item.id === pin.sampleId);
  if (check && sample) return `${check.title} – Prüfstelle ${sample.number}${sample.location ? " – " + sample.location : ""}`;
  if (check) return check.title;
  return "Allgemeine Feststellung";
}
function statusClass(status) {
  if (status.includes("OK") && !status.includes("nicht")) return "status ok";
  if (status.includes("Auflage")) return "status partial";
  if (status.includes("Mangel")) return "status bad";
  if (status.includes("Dokumentation")) return "status doc";
  return "status na";
}

function exportJson() {
  saveFromForm();
  const blob = new Blob([JSON.stringify(state.current, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `kai-bewehrungscheck-${state.current.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function exportFullBackup() {
  if (state.current) saveFromForm();
  const backupData = {
    type: "kai-bewehrungscheck-full-backup",
    version: 1,
    stableTag: STABLE_TAG,
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    projects: state.projects.map(normalizeProject),
    protocols: state.protocols.map(stripRuntimeFields),
    masterData: normalizeMasterData(state.masterData),
    settings: { ...state.settings, id: "app" },
    plans: await Promise.all((await idbGetAll("plans")).map(assetRecordToPackage)),
    photos: await Promise.all((await idbGetAll("photos")).map(assetRecordToPackage))
  };
  const name = sanitizeFileName(`Kai_BewehrungsCheck_Backup_${STABLE_TAG}_${new Date().toISOString().slice(0, 10)}.json`);
  downloadJson(backupData, name);
}

async function exportProjectPackage() {
  if (state.current) saveFromForm();
  const selectedProjectIds = state.currentProjectId ? [state.currentProjectId] : state.projects.map((project) => project.id);
  if (!selectedProjectIds.length) return alert("Kein Projekt zum Exportieren vorhanden.");
  const selectedProtocolIds = state.protocols.filter((protocol) => selectedProjectIds.includes(protocol.projectId)).map((protocol) => protocol.id);
  const planRecords = (await idbGetAll("plans")).filter((plan) => selectedProtocolIds.includes(plan.protocolId || plan.acceptanceId));
  const photoRecords = (await idbGetAll("photos")).filter((photo) => selectedProtocolIds.includes(photo.protocolId || photo.acceptanceId));
  const packageData = {
    type: "kai-bewehrungscheck-project-package",
    version: 1,
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    projects: state.projects.filter((project) => selectedProjectIds.includes(project.id)).map(normalizeProject),
    protocols: state.protocols.filter((protocol) => selectedProtocolIds.includes(protocol.id)).map(stripRuntimeFields),
    masterData: normalizeMasterData(state.masterData),
    plans: await Promise.all(planRecords.map(assetRecordToPackage)),
    photos: await Promise.all(photoRecords.map(assetRecordToPackage))
  };
  const firstProject = packageData.projects[0];
  const name = sanitizeFileName(`Kai_BewehrungsCheck_${firstProject?.name || "Projektpaket"}_${new Date().toISOString().slice(0, 10)}.json`);
  downloadJson(packageData, name);
}

async function assetRecordToPackage(record) {
  return {
    ...record,
    blob: record.blob ? await blobToDataUrl(record.blob) : ""
  };
}

function downloadJson(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function sanitizeFileName(value) {
  return String(value || "export.json")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

async function importFullBackup(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.type !== "kai-bewehrungscheck-full-backup") throw new Error("Keine vollständige Kai BewehrungsCheck Backup-Datei.");
    const projectCount = data.projects?.length || 0;
    const protocolCount = data.protocols?.length || 0;
    if (!confirm(`Backup importieren?\n\nAktuelle lokale Daten auf diesem Gerät werden ersetzt.\n\nBackup enthält:\n${projectCount} Projekt(e)\n${protocolCount} Abnahme(n)`)) return;
    await Promise.all([
      idbClear("projects"),
      idbClear("protocols"),
      idbClear("masterData"),
      idbClear("plans"),
      idbClear("photos"),
      idbClear("settings")
    ]);
    for (const project of data.projects || []) await idbPut("projects", normalizeProject(project));
    for (const protocol of data.protocols || []) await idbPut("protocols", stripRuntimeFields(normalizeProtocol(protocol)));
    await idbPut("masterData", normalizeMasterData(data.masterData));
    await idbPut("settings", { ...(data.settings || {}), id: "app" });
    for (const plan of data.plans || []) {
      await idbPut("plans", { ...plan, blob: plan.blob ? dataUrlToBlob(plan.blob) : new Blob([]) });
    }
    for (const photo of data.photos || []) {
      await idbPut("photos", { ...photo, blob: photo.blob ? dataUrlToBlob(photo.blob) : new Blob([]), barCountAnalysis: normalizeBarCountAnalysis(photo.barCountAnalysis) });
    }
    state.current = null;
    state.currentProjectId = "";
    state.selectedPlanId = "";
    state.selectedPinId = "";
    await load();
    renderHomeProjects();
    renderList();
    renderDatalists();
    await navigateToView("homeView");
    alert("Backup importiert.");
  } catch (error) {
    alert(`Backup konnte nicht importiert werden: ${error.message || error}`);
  } finally {
    $("#fullBackupInput").value = "";
  }
}

async function importProjectPackage(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.type !== "kai-bewehrungscheck-project-package") throw new Error("Keine Kai BewehrungsCheck Projektpaket-Datei.");
    for (const project of data.projects || []) await idbPut("projects", normalizeProject(project));
    for (const protocol of data.protocols || []) await idbPut("protocols", stripRuntimeFields(normalizeProtocol(protocol)));
    if (data.masterData) await idbPut("masterData", normalizeMasterData(data.masterData));
    for (const plan of data.plans || []) {
      await idbPut("plans", { ...plan, blob: plan.blob ? dataUrlToBlob(plan.blob) : new Blob([]) });
    }
    for (const photo of data.photos || []) {
      await idbPut("photos", { ...photo, blob: photo.blob ? dataUrlToBlob(photo.blob) : new Blob([]), barCountAnalysis: normalizeBarCountAnalysis(photo.barCountAnalysis) });
    }
    await load();
    renderHomeProjects();
    renderList();
    renderDatalists();
    alert("Projektpaket importiert.");
  } catch (error) {
    alert(`Projektpaket konnte nicht importiert werden: ${error.message || error}`);
  } finally {
    $("#projectPackageInput").value = "";
  }
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}


function bindOptional(selector, eventName, handler, options) {
  const element = $(selector);
  if (!element) {
    console.warn(`UI-Element nicht gefunden, Listener übersprungen: ${selector}`);
    return null;
  }
  element.addEventListener(eventName, handler, options);
  return element;
}

function bindEvents() {
  bindOptional("#newProjectBtn", "click", createProject);
  bindOptional("#newFromListBtn", "click", createProject);
  bindOptional("#backBtn", "click", async () => {
    const viewId = activeViewId();
    if (viewId === "dailyReportEditorView") saveDailyReportForm();
    if (viewId === "siteControlEditorView") saveSiteControlForm();
    if (viewId === "editorView") {
      saveFromForm();
      renderList();
    }
    if (viewId === "projectPlansView" && await returnFromProjectPlansView()) return;
    if (viewId === "masterDataView" && state.masterDataSection) {
      state.masterDataSection = "";
      renderMasterData();
      updateAppHeader("masterDataView");
      return;
    }
    const fallbackByView = {
      dailyReportEditorView: state.currentProjectId ? "projectHubView" : "dailyReportView",
      siteControlEditorView: state.currentProjectId ? "projectHubView" : "siteControlView",
      editorView: state.currentProjectId ? "projectHubView" : "listView",
      projectPlansView: "projectHubView",
      projectHubView: "projectDirectoryView",
      listView: state.currentProjectId ? "projectHubView" : "projectDirectoryView",
      siteControlView: state.currentProjectId ? "projectHubView" : "projectDirectoryView",
      dailyReportView: state.currentProjectId ? "projectHubView" : "projectDirectoryView",
      projectDirectoryView: "homeView"
    };
    await navigateBackOneStep(fallbackByView[viewId] || "homeView");
  });
  bindOptional("#saveBtn", "click", async () => {
    if ($("#masterDataView")?.classList.contains("active")) {
      const saved = await saveMasterData();
      if (saved) await navigateToView("homeView");
      return;
    }
    if ($("#dailyReportEditorView")?.classList.contains("active")) {
      saveDailyReportForm();
      showAppToast("Lokal gespeichert.");
      return;
    }
    if ($("#siteControlEditorView")?.classList.contains("active")) {
      saveSiteControlForm();
      showAppToast("Lokal gespeichert.");
      return;
    }
    saveFromForm();
    alert("Lokal gespeichert.");
  });
  $$("[data-nav]").forEach((btn) => btn.addEventListener("click", async (event) => {
    event.stopPropagation();
    await navigateToView(btn.dataset.nav);
  }));
  $$(".tab").forEach((btn) => btn.addEventListener("click", () => {
    saveFromForm();
    activateProtocolTab(btn.dataset.tab);
  }));
  bindOptional("#protocolForm", "input", (event) => {
    if (event.target.matches("[data-plan-field]")) {
      const plan = selectedPlan();
      if (plan && !isProjectPlan(plan)) {
        plan[event.target.dataset.planField] = event.target.value;
        syncPlanRecord(plan);
        saveFromForm({ persistNow: false });
      }
      return;
    }
    if (event.target.matches("[data-pin-field]")) {
      const pin = selectedPin();
      if (pin) {
        pin[event.target.dataset.pinField] = event.target.value;
        schedulePersist();
      }
      return;
    }
    if (event.target.matches("[data-check-field]")) {
      const article = event.target.closest("[data-check]");
      const item = state.current.checkpoints.find((check) => check.id === article.dataset.check);
      item[event.target.dataset.checkField] = event.target.value;
      activateCheck(item);
      schedulePersist();
      return;
    }
    if (event.target.id === "pinFindingSearchInput") {
      state.pinSearchQuery = event.target.value || "";
      renderChecklist();
      const input = document.getElementById("pinFindingSearchInput");
      if (input) {
        input.focus({ preventScroll: true });
        input.setSelectionRange(input.value.length, input.value.length);
      }
      return;
    }    if (event.target.matches("[data-sample-field]")) {
      const sample = findSample(event.target.closest("[data-sample]").dataset.sample);
      if (!sample) return;
      const check = findCheckBySample(sample.id);
      activateCheck(check);
      sample[event.target.dataset.sampleField] = event.target.value;
      if (isFollowupProtocol() && event.target.dataset.sampleField === "note") sample.followupNote = event.target.value;
      if (event.target.dataset.sampleField === "pinId") {
        const pin = state.current.pins.find((item) => item.id === event.target.value);
        const placement = pin ? (pinPlacements(pin).find((item) => item.isPrimary) || pinPlacements(pin)[0]) : null;
        sample.planId = placement?.planId || pin?.planId || "";
        sample.pageNumber = placement?.pageNumber || pin?.pageNumber || 1;
      }
      sample.updatedAt = new Date().toISOString();
      if (check) updateCheckStatus(check);
      schedulePersist();
      return;
    }
    if (event.target.matches("[data-overlap-field]")) {
      const sample = findSample(event.target.closest("[data-sample]").dataset.sample);
      if (!sample) return;
      activateCheck(findCheckBySample(sample.id));
      sample.overlapCheck = updateOverlapField(sample.overlapCheck || defaultOverlapCheck(sample), event.target.dataset.overlapField, event.target.value);
      sample.overlapCheckOpen = true;
      sample.updatedAt = new Date().toISOString();
      schedulePersist();
      if (event.target.tagName === "SELECT" || event.target.dataset.overlapField === "mode") renderChecklist();
      return;
    }
    if (event.target.matches("[data-signature-field]")) {
      const signature = findSignature(event.target.closest("[data-signature]").dataset.signature);
      if (!signature) return;
      signature[event.target.dataset.signatureField] = event.target.value || "";
      schedulePersist();
      return;
    }
    if (event.target.matches("[data-overview-caption]")) {
      const overviewPhoto = overviewPhotoById(event.target.dataset.overviewCaption);
      if (!overviewPhoto) return;
      overviewPhoto.caption = event.target.value || "";
      overviewPhoto.updatedAt = new Date().toISOString();
      schedulePersist();
      return;
    }
    saveFromForm({ persistNow: false });
  });
  bindOptional("#protocolForm", "change", (event) => {
    if (event.target.matches("[data-plan-field]")) {
      if (!isProjectPlan(selectedPlan())) persist();
      renderPlanListStatus();
      return;
    }
    if (event.target.matches("[data-pin-field]")) {
      renderPinList();
      persist();
      return;
    }
    if (event.target.matches("[data-sample-field]")) {
      persist();
      return;
    }
    if (event.target.matches("[data-overlap-field]")) {
      persist();
      if (event.target.tagName !== "TEXTAREA") renderChecklist();
      return;
    }
    if (event.target.matches("[data-signature-field]")) {
      const signature = findSignature(event.target.closest("[data-signature]").dataset.signature);
      if (!signature) return;
      applySignatureMasterSelection(signature, event.target.dataset.signatureField, event.target.value || "");
      persist();
      if (["name", "company"].includes(event.target.dataset.signatureField)) renderSignatures();
      return;
    }
    if (event.target.matches("[data-overview-caption]")) {
      persist();
      return;
    }
    if (event.target.matches('[name="component"]')) {
      saveFromForm();
      applyCheckScopeTemplate({ confirmUser: true });
    }
  });
  const dailyReportForm = $("#dailyReportForm");
  if (dailyReportForm) {
    dailyReportForm.addEventListener("input", (event) => {
      if (event.target.matches("[data-daily-photo-caption]")) {
        updateDailyPhotoCaption(event.target);
        return;
      }
      if (event.target.matches("[data-daily-worker-field]")) {
        updateDailyWorkerField(event.target);
        return;
      }
      saveDailyReportForm({ persistNow: false });
    });
    dailyReportForm.addEventListener("change", (event) => {
      if (event.target.matches("[data-daily-photo-caption]")) {
        updateDailyPhotoCaption(event.target);
        return;
      }
      if (event.target.matches("[data-daily-worker-field]")) {
        updateDailyWorkerField(event.target);
        persist();
        return;
      }
      if (event.target.matches('[name="dailyStart"], [name="dailyEnd"]')) {
        event.target.value = normalizeTimeValue(event.target.value || "");
      }
      saveDailyReportForm();
    });
    dailyReportForm.addEventListener("focusin", (event) => {
      if (event.target.matches('[name="dailyStart"], [name="dailyEnd"], [data-daily-worker-field="start"], [data-daily-worker-field="end"]') && !event.target.value) {
        event.target.value = event.target.matches('[name="dailyEnd"], [data-daily-worker-field="end"]') ? "16:00" : "07:00";
      }
    });
  }
  const siteControlForm = $("#siteControlForm");
  if (siteControlForm) {
    siteControlForm.addEventListener("input", (event) => {
      if (event.target.matches("[data-site-item-field]")) {
        updateSiteControlItemField(event.target);
        return;
      }
      saveSiteControlForm({ persistNow: false });
    });
    siteControlForm.addEventListener("change", (event) => {
      if (event.target.matches("[data-site-item-field]")) {
        updateSiteControlItemField(event.target);
        return;
      }
      saveSiteControlForm();
    });
  }
  bindOptional("#masterDataPanel", "input", handleMasterDataInput);
  bindOptional("#masterDataPanel", "change", handleMasterDataInput);
  bindOptional("#projectSearchInput", "input", renderProjectDirectory);
  bindOptional("#projectPlansContent", "input", (event) => {
    if (event.target.matches("#projectPlanSearchInput")) {
      renderProjectPlansView();
      const search = $("#projectPlanSearchInput");
      if (search) {
        search.focus();
        const length = search.value.length;
        search.setSelectionRange(length, length);
      }
      return;
    }
    if (event.target.matches("[data-project-plan-field]")) updateProjectPlanField(event.target);
  });
  bindOptional("#projectPlansContent", "change", (event) => {
    if (event.target.matches("#projectPlanUploadInput")) {
      importProjectPlanFiles(event.target.files || [], state.currentProjectId);
      event.target.value = "";
      return;
    }
    if (event.target.matches("[data-project-plan-field]")) {
      updateProjectPlanField(event.target);
      renderProjectPlansView();
      persist();
    }
  });
  bindOptional("#projectPlansContent", "toggle", (event) => {
    const details = event.target?.closest?.(".project-plan-accordion");
    if (!details || !details.open) return;
    $$(".project-plan-accordion", $("#projectPlansContent")).forEach((item) => {
      if (item !== details) item.open = false;
    });
  }, true);
  bindOptional("#markPinSheet", "input", (event) => {
    if (!event.target.matches("[data-mark-pin-field]")) return;
    const pin = state.current?.pins.find((item) => item.id === state.selectedPinId);
    if (!pin) return;
    pin[event.target.dataset.markPinField] = event.target.value;
    pin.updatedAt = new Date().toISOString();
    const siteItem = pin.itemId ? findSiteControlItem(pin.itemId) : null;
    const sample = !siteItem && pin.sampleId ? findSample(pin.sampleId) : null;
    if (sample && event.target.dataset.markPinField === "note") {
      sample.note = event.target.value;
      sample.updatedAt = pin.updatedAt;
    }
    if (siteItem) {
      if (event.target.dataset.markPinField === "note") siteItem.description = event.target.value || siteItem.description || "";
      if (event.target.dataset.markPinField === "status") siteItem.status = pin.status || siteItem.status;
      syncSiteControlItemPinReference(siteItem, pin);
    }
    schedulePersist();
    renderMarkPins();
  });
  bindOptional("#markPinSheet", "change", (event) => {
    if (!event.target.matches("[data-mark-pin-field]")) return;
    const pin = state.current?.pins.find((item) => item.id === state.selectedPinId);
    if (!pin) return;
    pin[event.target.dataset.markPinField] = event.target.value;
    pin.updatedAt = new Date().toISOString();
    const siteItem = pin.itemId ? findSiteControlItem(pin.itemId) : null;
    const sample = !siteItem && pin.sampleId ? findSample(pin.sampleId) : null;
    if (sample && event.target.dataset.markPinField === "status") {
      sample.status = event.target.value;
      sample.updatedAt = pin.updatedAt;
      const check = findCheckBySample(sample.id);
      if (check) updateCheckStatus(check);
    }
    if (siteItem) {
      if (event.target.dataset.markPinField === "note") siteItem.description = event.target.value || siteItem.description || "";
      if (event.target.dataset.markPinField === "status") siteItem.status = pin.status || siteItem.status;
      syncSiteControlItemPinReference(siteItem, pin);
    }
    persist();
    if (siteItem) renderSiteControlEditor(); else renderChecklist();
  });
  document.addEventListener("click", (event) => {
    const dynamicNav = event.target.closest("[data-nav]");
    if (dynamicNav) navigateToView(dynamicNav.dataset.nav);
    const siteNewProject = event.target.closest("#siteNewProjectBtn");
    if (siteNewProject) createProject();
    const newDailyReport = event.target.closest("[data-new-daily-report], #newDailyReportBtn");
    if (newDailyReport) createBlankDailyReport(newDailyReport.dataset.newDailyReport || state.currentProjectId);
    const openDailyReport = event.target.closest("[data-open-daily-report]");
    if (openDailyReport) openDailyReportProtocol(state.protocols.find((p) => p.id === openDailyReport.dataset.openDailyReport));
    const deleteDailyReport = event.target.closest("[data-delete-daily-report]");
    if (deleteDailyReport && confirm("Diesen Bautagesbericht löschen?")) deleteDailyReportProtocol(deleteDailyReport.dataset.deleteDailyReport);
    const dailyPhotoCamera = event.target.closest("#dailyPhotoCameraBtn");
    if (dailyPhotoCamera) triggerDailyPhotoPicker("camera");
    const dailyPhotoGallery = event.target.closest("#dailyPhotoGalleryBtn");
    if (dailyPhotoGallery) triggerDailyPhotoPicker("gallery");
    const deleteDailyPhoto = event.target.closest("[data-delete-daily-photo]");
    if (deleteDailyPhoto && confirm("Dieses Foto löschen?")) deleteDailyPhotoRef(deleteDailyPhoto.dataset.deleteDailyPhoto);
    const addDailyWorkerButton = event.target.closest("#addDailyWorkerBtn");
    if (addDailyWorkerButton) addDailyWorker();
    const deleteDailyWorkerButton = event.target.closest("[data-delete-daily-worker]");
    if (deleteDailyWorkerButton && confirm("Diesen Mitarbeiter aus dem Bautagesbericht entfernen?")) deleteDailyWorker(deleteDailyWorkerButton.dataset.deleteDailyWorker);
    const dailyWeatherAuto = event.target.closest("#dailyWeatherAutoBtn");
    if (dailyWeatherAuto) fillDailyReportWeatherFromLocation();
    const dailyTranslate = event.target.closest("[data-daily-translate]");
    if (dailyTranslate) runDailyTranslation(dailyTranslate.dataset.dailyTranslate);
    const dailyCopyPrompt = event.target.closest("[data-daily-copy-prompt]");
    if (dailyCopyPrompt) copyDailyTranslationPrompt(dailyCopyPrompt.dataset.dailyCopyPrompt);
    const dailyApplyTranslation = event.target.closest("#dailyApplyTranslationBtn");
    if (dailyApplyTranslation) applyDailyGermanTranslation();
    const dailyAnalyzeVoice = event.target.closest("#dailyAnalyzeVoiceBtn");
    if (dailyAnalyzeVoice) applyDailyVoiceExtraction($("#dailyReportForm")?.elements?.dailyVoiceDraft?.value || state.current?.dailyReport?.voiceDraft || "");
    const dailyPdfSave = event.target.closest("#dailyPdfSaveBtn");
    if (dailyPdfSave) savePdfFromA4ReportWithPhotoWarning();
    const dailyPdfPreview = event.target.closest("#dailyPdfPreviewBtn");
    if (dailyPdfPreview) openReportDialogWithPhotoWarning({ printHint: false }).then((opened) => { if (opened !== false) setReportPreviewMode("a4"); });
    const newSiteControl = event.target.closest("[data-new-site-control]");
    if (newSiteControl) createBlankSiteControl(newSiteControl.dataset.newSiteControl);
    const openSiteControl = event.target.closest("[data-open-site-control]");
    if (openSiteControl) openSiteControlProtocol(state.protocols.find((p) => p.id === openSiteControl.dataset.openSiteControl));
    const addSiteItem = event.target.closest("[data-add-site-item]");
    if (addSiteItem) addSiteControlItem(addSiteItem.dataset.addSiteItem);
    const sitePhotoCamera = event.target.closest("[data-site-photo-camera]");
    if (sitePhotoCamera) triggerSiteControlPhotoPicker(sitePhotoCamera.dataset.sitePhotoCamera, "camera");
    const sitePhotoGallery = event.target.closest("[data-site-photo-gallery]");
    if (sitePhotoGallery) triggerSiteControlPhotoPicker(sitePhotoGallery.dataset.sitePhotoGallery, "gallery");
    const deleteSitePhoto = event.target.closest("[data-delete-site-photo]");
    if (deleteSitePhoto && confirm("Dieses Foto löschen?")) {
      const item = findSiteControlItem(deleteSitePhoto.dataset.deleteSitePhoto);
      if (item) {
        item.photos = item.photos.filter((photo) => photo.id !== deleteSitePhoto.dataset.photoId);
        idbDelete("photos", deleteSitePhoto.dataset.photoId);
        persist();
        renderSiteControlEditor();
      }
    }
    const markSiteItem = event.target.closest("[data-mark-site-item]");
    if (markSiteItem) openSiteControlPlanMarkDialog(markSiteItem.dataset.markSiteItem, { reset: true });
    const showSitePin = event.target.closest("[data-show-site-pin]");
    if (showSitePin) {
      const item = findSiteControlItem(showSitePin.dataset.showSitePin);
      if (item?.pinId) openSiteControlPlanMarkDialog(item.id, { reset: false });
    }
    const removeSitePinButton = event.target.closest("[data-remove-site-pin]");
    if (removeSitePinButton && confirm("Planbezug dieser Feststellung entfernen?")) {
      const item = findSiteControlItem(removeSitePinButton.dataset.removeSitePin);
      if (item?.pinId) removeMarkPin(item.pinId);
      else if (item) {
        clearSiteControlItemPin(item);
        persist();
        renderSiteControlEditor();
      }
    }
    const deleteSiteItem = event.target.closest("[data-delete-site-item]");
    if (deleteSiteItem && confirm("Diese Feststellung löschen?")) {
      state.current.siteItems = (state.current.siteItems || []).filter((item) => item.id !== deleteSiteItem.dataset.deleteSiteItem);
      persist();
      renderSiteControlEditor();
    }
    const siteAddressFromProject = event.target.closest("#siteAddressFromProjectBtn");
    if (siteAddressFromProject) applySiteControlProjectAddress();
    const dailyAddressFromProject = event.target.closest("#dailyAddressFromProjectBtn");
    if (dailyAddressFromProject) applyDailyReportProjectAddress();
    const siteWeatherAuto = event.target.closest("#siteWeatherAutoBtn");
    if (siteWeatherAuto) fillSiteControlWeatherFromLocation();
    const sitePdfSave = event.target.closest("#sitePdfSaveBtn");
    if (sitePdfSave) savePdfFromA4ReportWithPhotoWarning();
    const sitePdfPreview = event.target.closest("#sitePdfPreviewBtn");
    if (sitePdfPreview) openReportDialogWithPhotoWarning({ printHint: false }).then((opened) => { if (opened !== false) setReportPreviewMode("a4"); });
    const openProjectPlanButton = event.target.closest("[data-open-project-plan]");
    if (openProjectPlanButton) openProjectPlanPreview(openProjectPlanButton.dataset.protocolId, openProjectPlanButton.dataset.openProjectPlan);
    const openDropboxLink = event.target.closest("[data-open-dropbox-link]");
    if (openDropboxLink) openProjectPlanDropboxLink(openDropboxLink.dataset.protocolId, openDropboxLink.dataset.openDropboxLink);
    const useProjectPlanButton = event.target.closest("[data-use-project-plan]");
    if (useProjectPlanButton) useProjectPlanForCurrentAcceptance(useProjectPlanButton.dataset.protocolId, useProjectPlanButton.dataset.useProjectPlan);
    const projectPlanUpload = event.target.closest("#projectPlanUploadBtn");
    if (projectPlanUpload) $("#projectPlanUploadInput")?.click();
    const deleteProjectPlanButton = event.target.closest("[data-delete-project-plan]");
    if (deleteProjectPlanButton) deleteProjectPlan(deleteProjectPlanButton.dataset.protocolId, deleteProjectPlanButton.dataset.deleteProjectPlan);
    const projectModule = event.target.closest("[data-project-module]");
    if (projectModule) {
      const action = projectModule.dataset.projectModule;
      if (action === "home") navigateToView("homeView");
      if (action === "directory") navigateToView("projectDirectoryView");
      if (action === "rebar") navigateToView("listView");
      if (action === "site") navigateToView("siteControlView");
      if (action === "daily") navigateToView("dailyReportView");
      if (action === "projectData") openProjectDialog(state.currentProjectId);
      if (action === "plans") {
        rememberProjectPlansReturnContext();
        navigateToView("projectPlansView");
      }
      if (action === "openPoints") showAppToast("Offene Punkte sind in den Listen der Projektzentrale sichtbar.", { type: "info" });
      if (action === "reports") showAppToast("Berichte und Protokolle findest du aktuell in den jeweiligen Modulen.", { type: "info" });
    }
    const projectHubNewProject = event.target.closest("#projectHubNewProjectBtn");
    if (projectHubNewProject) createProject();
    const masterSectionButton = event.target.closest("[data-master-section]");
    if (masterSectionButton) {
      state.masterDataSection = masterSectionButton.dataset.masterSection;
      renderMasterData();
      updateAppHeader("masterDataView");
      return;
    }
    const masterOverviewButton = event.target.closest("[data-master-overview]");
    if (masterOverviewButton) {
      state.masterDataSection = "";
      renderMasterData();
      updateAppHeader("masterDataView");
      return;
    }
    const addMaster = event.target.closest("[data-add-master]");
    if (addMaster) addMasterItem(addMaster.dataset.addMaster);
    const deleteMaster = event.target.closest("[data-delete-master]");
    if (deleteMaster && confirm("Diesen Stammdatensatz löschen?")) deleteMasterItem(deleteMaster.dataset.deleteMaster, deleteMaster.dataset.masterId);
    const addLookup = event.target.closest("[data-add-lookup]");
    if (addLookup) addLookupValue(addLookup.dataset.addLookup);
    const deleteLookup = event.target.closest("[data-delete-lookup]");
    if (deleteLookup && confirm("Diesen Wert löschen?")) {
      const key = deleteLookup.dataset.deleteLookup;
      state.masterData[key].splice(Number(deleteLookup.dataset.lookupIndex), 1);
      setMasterDataDirty(true);
      renderDatalists();
      renderMasterData();
    }
    const openProject = event.target.closest("[data-open-project]");
    if (openProject) {
      state.currentProjectId = openProject.dataset.openProject;
      navigateToView("projectHubView");
    }
    const editProject = event.target.closest("[data-edit-project]");
    if (editProject) openProjectDialog(editProject.dataset.editProject);
    const newAcceptance = event.target.closest("[data-new-acceptance]");
    if (newAcceptance) openAcceptanceDialog(newAcceptance.dataset.newAcceptance);
    const retryPlan = event.target.closest("#retryPlanRenderBtn");
    if (retryPlan) renderPlan();
    const chooseAnotherPlan = event.target.closest("#chooseAnotherPlanBtn");
    if (chooseAnotherPlan) $("#planInput").click();
    const duplicateAcceptance = event.target.closest("[data-duplicate-acceptance]");
    if (duplicateAcceptance) openDuplicateDialog(duplicateAcceptance.dataset.duplicateAcceptance);
    const createFollowup = event.target.closest("[data-create-followup]");
    if (createFollowup) createFollowupFromOpenPoints(createFollowup.dataset.createFollowup);
    const deleteProjectButton = event.target.closest("[data-delete-project]");
    if (deleteProjectButton && confirmProjectDeletion(deleteProjectButton.dataset.deleteProject)) {
      deleteProject(deleteProjectButton.dataset.deleteProject).then(renderList);
    }
    const open = event.target.closest("[data-open]");
    if (open) openProtocol(state.protocols.find((p) => p.id === open.dataset.open));
    const del = event.target.closest("[data-delete]");
    if (del && confirm("Diese Abnahme lokal löschen?")) {
      deleteProtocol(del.dataset.delete);
      renderList();
    }
    const selectPlan = event.target.closest("[data-select-plan]");
    if (selectPlan) switchPlan(selectPlan.dataset.selectPlan);
    const pinButton = event.target.closest("[data-pin]");
    if (pinButton) {
      state.selectedPinId = pinButton.dataset.pin;
      renderPlan();
      renderPinEditor();
    }
    const markPinButton = event.target.closest("[data-mark-pin]");
    if (markPinButton) {
      state.selectedPinId = markPinButton.dataset.markPin;
      renderMarkPins();
      renderMarkPinSheet(state.selectedPinId);
    }
    if (event.target.closest("[data-close-mark-pin-sheet]")) {
      renderMarkPinSheet("");
    }
    const moveMarkPinButton = event.target.closest("[data-move-mark-pin]");
    if (moveMarkPinButton) {
      startMoveMarkPin(moveMarkPinButton.dataset.moveMarkPin);
    }
    const resetMarkPinButton = event.target.closest("[data-reset-mark-pin]");
    if (resetMarkPinButton) {
      startResetMarkPin(resetMarkPinButton.dataset.resetMarkPin);
    }
    if (event.target.closest("[data-cancel-mark-pin-move]")) {
      cancelMarkPinPlacement();
    }
    const markPinPhoto = event.target.closest("[data-mark-pin-photo]");
    if (markPinPhoto && state.selectedPinId) {
      triggerInlinePhotoPicker("pin", state.selectedPinId, markPinPhoto.dataset.markPinPhoto);
    }
    if (event.target.closest("[data-return-sample-from-mark]")) {
      const wasSiteControl = isSiteControlProtocol();
      closePlanMarkDialog();
      if (wasSiteControl) renderSiteControlEditor(); else renderChecklist();
    }
    const removeMarkPinButton = event.target.closest("[data-remove-mark-pin]");
    if (removeMarkPinButton && confirm("Pin wirklich entfernen?")) {
      removeMarkPin(removeMarkPinButton.dataset.removeMarkPin);
    }
    const statusPin = event.target.closest("[data-pin-status]");
    if (statusPin) {
      selectedPin().status = statusPin.dataset.pinStatus;
      persist();
      renderPinEditor();
      renderPinList();
    }
    const checkActiveToggle = event.target.closest("[data-check-active]");
    if (checkActiveToggle) {
      const check = state.current.checkpoints.find((item) => item.id === checkActiveToggle.dataset.checkActive);
      if (check) {
        check.active = checkActiveToggle.checked;
        check.manuallyActivated = checkActiveToggle.checked;
        if (checkHasDocumentation(check)) check.active = true;
        persist();
        renderChecklist();
      }
    }
    const openPinFindingButton = event.target.closest("[data-open-pin-finding]");
    if (openPinFindingButton) return openPinFinding(openPinFindingButton.dataset.openPinFinding);
    const showPinFindingButton = event.target.closest("[data-show-pin-finding]");
    if (showPinFindingButton) return showPinFindingOnPlan(showPinFindingButton.dataset.showPinFinding);
    const reassignSampleButton = event.target.closest("[data-reassign-sample]");
    if (reassignSampleButton) return openReassignSampleDialog(reassignSampleButton.dataset.reassignSample);
    const activateCheckButton = event.target.closest("[data-activate-check]");
    if (activateCheckButton) {
      const check = state.current.checkpoints.find((item) => item.id === activateCheckButton.dataset.activateCheck);
      activateCheck(check, true);
      persist();
      renderChecklist();
    }
    const checkFilter = event.target.closest("[data-check-filter]");
    if (checkFilter) {
      state.checkScopeOnlyActive = checkFilter.dataset.checkFilter === "active";
      renderChecklist();
    }
    const applyTemplate = event.target.closest("[data-apply-check-template]");
    if (applyTemplate) applyCheckScopeTemplate();
    const toggleCheckPanel = event.target.closest("[data-toggle-check-panel]");
    if (toggleCheckPanel) {
      const id = toggleCheckPanel.dataset.toggleCheckPanel;
      state.openCheckId = state.openCheckId === id ? "" : id;
      renderChecklist();
      return;
    }
    const statusCheck = event.target.closest("[data-check-status]");
    if (statusCheck) {
      const item = state.current.checkpoints.find((check) => check.id === statusCheck.closest("[data-check]").dataset.check);
      activateCheck(item);
      item.status = statusCheck.dataset.checkStatus;
      persist();
      renderChecklist();
    }
    const toggleSamplePanel = event.target.closest("[data-toggle-sample-panel]");
    if (toggleSamplePanel) {
      const id = toggleSamplePanel.dataset.toggleSamplePanel;
      const sample = findSample(id);
      const check = sample ? findCheckBySample(id) : null;
      if (check) state.openCheckId = check.id;
      state.openSampleId = state.openSampleId === id ? "" : id;
      renderChecklist();
      return;
    }
    const addSampleButton = event.target.closest("[data-add-sample]");
    if (addSampleButton) addSample(addSampleButton.dataset.addSample);
    const duplicateSampleButton = event.target.closest("[data-duplicate-sample]");
    if (duplicateSampleButton) duplicateSample(duplicateSampleButton.dataset.duplicateSample);
    const deleteSampleButton = event.target.closest("[data-delete-sample]");
    if (deleteSampleButton && confirm("Diese Prüfstelle wirklich löschen?")) {
      deleteSample(deleteSampleButton.dataset.deleteSample);
    }
    const toggleOverlap = event.target.closest("[data-toggle-overlap]");
    if (toggleOverlap) {
      const sample = findSample(toggleOverlap.dataset.toggleOverlap);
      if (sample) {
        sample.overlapCheckOpen = !sample.overlapCheckOpen;
        sample.overlapCheck = sample.overlapCheck || defaultOverlapCheck(sample);
        activateCheck(findCheckBySample(sample.id));
        persist();
        renderChecklist();
      }
    }
    const calcOverlap = event.target.closest("[data-calc-overlap]");
    if (calcOverlap) {
      const sample = findSample(calcOverlap.dataset.calcOverlap);
      if (sample) {
        sample.overlapCheck = persistableOverlapCalc(calculateOverlap(sample.overlapCheck || defaultOverlapCheck(sample), sample), sample);
        sample.overlapCheckOpen = true;
        activateCheck(findCheckBySample(sample.id));
        persist();
        renderChecklist();
      }
    }
    const conservativeOverlap = event.target.closest("[data-overlap-conservative]");
    if (conservativeOverlap) {
      const sample = findSample(conservativeOverlap.closest("[data-sample]").dataset.sample);
      if (sample) {
        sample.overlapCheck = conservativeOverlapAssumptions(sample.overlapCheck || defaultOverlapCheck(sample));
        sample.overlapCheckOpen = true;
        activateCheck(findCheckBySample(sample.id));
        persist();
        renderChecklist();
      }
    }
    const applyOverlap = event.target.closest("[data-apply-overlap]");
    if (applyOverlap) applyOverlapToSample(applyOverlap.dataset.applyOverlap);
    const statusSample = event.target.closest("[data-sample-status]");
    if (statusSample) {
      const sample = findSample(statusSample.closest("[data-sample]").dataset.sample);
      if (sample) {
        sample.status = statusSample.dataset.sampleStatus;
        sample.updatedAt = new Date().toISOString();
        const check = findCheckBySample(sample.id);
        activateCheck(check);
        if (check) updateCheckStatus(check);
        persist();
        renderChecklist();
      }
    }
    const followupStatus = event.target.closest("[data-followup-status]");
    if (followupStatus) {
      const sample = findSample(followupStatus.closest("[data-sample]").dataset.sample);
      if (sample) {
        sample.followupStatus = followupStatus.dataset.followupStatus;
        sample.status = sample.followupStatus;
        sample.updatedAt = new Date().toISOString();
        const check = findCheckBySample(sample.id);
        activateCheck(check);
        if (check) updateCheckStatus(check);
        persist();
        renderChecklist();
      }
    }
    const photoPinCamera = event.target.closest("[data-photo-pin-camera]");
    if (photoPinCamera) triggerPhotoPicker("pin", photoPinCamera.dataset.photoPinCamera, "camera");
    const photoPinGallery = event.target.closest("[data-photo-pin-gallery]");
    if (photoPinGallery) triggerPhotoPicker("pin", photoPinGallery.dataset.photoPinGallery, "gallery");
    const photoPin = event.target.closest("[data-photo-pin]");
    if (photoPin) openPhotoDialog("pin", photoPin.dataset.photoPin);
    const photoCheck = event.target.closest("[data-photo-check]");
    if (photoCheck) openPhotoDialog("check", photoCheck.dataset.photoCheck);
    const photoSampleCamera = event.target.closest("[data-photo-sample-camera]");
    if (photoSampleCamera) triggerPhotoPicker("sample", photoSampleCamera.dataset.photoSampleCamera, "camera");
    const photoSampleGallery = event.target.closest("[data-photo-sample-gallery]");
    if (photoSampleGallery) triggerPhotoPicker("sample", photoSampleGallery.dataset.photoSampleGallery, "gallery");
    const photoSample = event.target.closest("[data-photo-sample]");
    if (photoSample) openPhotoDialog("sample", photoSample.dataset.photoSample);
    const backupShare = event.target.closest("[data-photo-backup-share]");
    if (backupShare) return shareOrDownloadPhoto(backupShare.dataset.photoBackupShare, "share");
    const backupDownload = event.target.closest("[data-photo-backup-download]");
    if (backupDownload) return shareOrDownloadPhoto(backupDownload.dataset.photoBackupDownload, "download");
    const backupConfirm = event.target.closest("[data-photo-backup-confirm]");
    if (backupConfirm) return confirmPhotoExternalBackup(backupConfirm.dataset.photoBackupConfirm);
    const barCountPhoto = event.target.closest("[data-bar-count-photo]");
    if (barCountPhoto) openBarCountDialog(barCountPhoto.dataset.barCountPhoto);
    const overviewPhotoButton = event.target.closest("[data-overview-photo]");
    if (overviewPhotoButton) triggerOverviewPhotoPicker(overviewPhotoButton.dataset.overviewPhoto);
    const overviewUp = event.target.closest("[data-overview-up]");
    if (overviewUp) moveOverviewPhoto(overviewUp.dataset.overviewUp, -1);
    const overviewDown = event.target.closest("[data-overview-down]");
    if (overviewDown) moveOverviewPhoto(overviewDown.dataset.overviewDown, 1);
    const overviewCover = event.target.closest("[data-overview-cover]");
    if (overviewCover) toggleOverviewCover(overviewCover.dataset.overviewCover);
    const overviewDelete = event.target.closest("[data-overview-delete]");
    if (overviewDelete && confirm("Dieses Übersichtsfoto löschen?")) deleteOverviewPhoto(overviewDelete.dataset.overviewDelete);
    const deleteSamplePhoto = event.target.closest("[data-delete-sample-photo]");
    if (deleteSamplePhoto && confirm("Dieses Foto aus der Prüfstelle löschen?")) {
      const sample = findSample(deleteSamplePhoto.dataset.deleteSamplePhoto);
      if (sample) {
        sample.photos = sample.photos.filter((photo) => photo.id !== deleteSamplePhoto.dataset.photoId);
        sample.updatedAt = new Date().toISOString();
        idbDelete("photos", deleteSamplePhoto.dataset.photoId);
        persist();
        renderChecklist();
      }
    }
    const markSample = event.target.closest("[data-mark-sample]");
    if (markSample) openPlanMarkDialog(markSample.dataset.markSample);
    const showSamplePin = event.target.closest("[data-show-sample-pin]");
    if (showSamplePin) {
      const sample = findSample(showSamplePin.dataset.showSamplePin);
      if (sample?.pinId) openPlanMarkDialog(sample.id);
    }
    const removeSamplePin = event.target.closest("[data-remove-sample-pin]");
    if (removeSamplePin && confirm("Planmarkierung von dieser Prüfstelle entfernen?")) removePinFromSample(removeSamplePin.dataset.removeSamplePin);
    const removePin = event.target.closest("[data-remove-pin]");
    if (removePin && confirm("Pin löschen?")) {
      state.current.pins = state.current.pins.filter((pin) => pin.id !== removePin.dataset.removePin);
      state.current.checkpoints.forEach((check) => { if (check.pinId === removePin.dataset.removePin) check.pinId = ""; });
      state.current.checkpoints.forEach((check) => check.samples.forEach((sample) => {
        if (sample.pinId === removePin.dataset.removePin) {
          sample.pinId = "";
          sample.planId = "";
          sample.pageNumber = 1;
        }
      }));
      state.selectedPinId = currentPins()[0]?.id || "";
      if (state.placementModePinId === removePin.dataset.removePin) state.placementModePinId = "";
      persist();
      renderPlan();
      renderPinEditor();
      renderChecklist();
    }
    const addPlacement = event.target.closest("[data-add-placement]");
    if (addPlacement) startPlacementMode(addPlacement.dataset.addPlacement);
    const removePlacement = event.target.closest("[data-remove-placement]");
    if (removePlacement && confirm("Diese Platzierung entfernen?")) removePinPlacement(removePlacement.dataset.removePlacement, removePlacement.dataset.placementId);
    const primaryPlacement = event.target.closest("[data-primary-placement]");
    if (primaryPlacement) makePrimaryPlacement(primaryPlacement.dataset.primaryPlacement, primaryPlacement.dataset.placementId);
    const editSig = event.target.closest("[data-edit-signature]");
    if (editSig) editSignature(editSig.dataset.editSignature);
    const resetSig = event.target.closest("[data-reset-signature]");
    if (resetSig) resetSignature(resetSig.dataset.resetSignature);
    const saveSig = event.target.closest("[data-save-signature]");
    if (saveSig) saveSignature(saveSig.dataset.saveSignature, event);
    const deleteSig = event.target.closest("[data-delete-signature]");
    if (deleteSig && confirm("Diese Unterschrift wirklich löschen?")) deleteSignature(deleteSig.dataset.deleteSignature);
    const pdfSave = event.target.closest("#pdfSaveBtn");
    if (pdfSave) savePdfFromA4ReportWithPhotoWarning();
    const pdfShare = event.target.closest("#pdfShareBtn");
    if (pdfShare) triggerSavedPdfSharePicker();
    const copyReportTextMain = event.target.closest("#copyReportTextMainBtn");
    if (copyReportTextMain) shareReportText();
    const pdfPreview = event.target.closest("#pdfPreviewBtn");
    if (pdfPreview) openReportDialogWithPhotoWarning({ printHint: false }).then((opened) => { if (opened !== false) setReportPreviewMode("a4"); });
    const deletePlanButton = event.target.closest("[data-delete-plan]");
    if (deletePlanButton && confirm("Plan wirklich löschen? Zugeordnete Pins auf diesem Plan werden ebenfalls entfernt.")) deletePlanById(deletePlanButton.dataset.deletePlan);
  });
  bindOptional("#addPlanBtn", "click", () => $("#planInput").click());
  bindOptional("#importPlansBtn", "click", openPlanImportDialog);
  bindOptional("#addSignatureBtn", "click", addSignature);
  bindOptional("#createProjectConfirmBtn", "click", createProjectFromDialog);
  bindOptional("#projectClientToMasterBtn", "click", () => addProjectFieldToMaster("client"));
  bindOptional("#projectContractorToMasterBtn", "click", () => addProjectFieldToMaster("contractor"));
  bindOptional("#projectInspectorToMasterBtn", "click", () => addProjectFieldToMaster("inspector"));
  bindOptional("#projectDefaultInspectorToMasterBtn", "click", () => addProjectFieldToMaster("defaultInspector"));
  bindOptional("#createAcceptanceConfirmBtn", "click", createProtocolFromDialog);
  bindOptional("#acceptanceTypeToMasterBtn", "click", () => saveLookupFromAcceptanceDialog("acceptanceTypes", "#acceptanceTypeInput", "eine Abnahmeart"));
  bindOptional("#acceptanceComponentToMasterBtn", "click", () => saveLookupFromAcceptanceDialog("components", "#acceptanceComponentInput", "ein Bauteil"));
  bindOptional("#acceptanceFloorToMasterBtn", "click", () => saveLookupFromAcceptanceDialog("floors", "#acceptanceFloorInput", "ein Geschoss"));
  bindOptional("#acceptanceAreaToMasterBtn", "click", () => saveLookupFromAcceptanceDialog("areaAxes", "#acceptanceAreaInput", "einen Bereich oder eine Achse"));
  bindOptional("#cancelAcceptanceBtn", "click", closeAcceptanceDialog);
  bindOptional("#acceptanceDialog", "click", (event) => {
    if (event.target === event.currentTarget) closeAcceptanceDialog();
  });
  bindOptional("#acceptanceDialog", "cancel", () => {
    state.pendingAcceptanceProjectId = "";
  });
  bindOptional("#acceptanceDialog", "close", () => {
    const returnFocus = state.acceptanceDialogReturnFocus;
    state.acceptanceDialogReturnFocus = null;
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
  });
  bindOptional("#cancelDuplicateBtn", "click", () => $("#duplicateDialog").close());
  bindOptional("#createDuplicateBtn", "click", () => duplicateProtocol($("#duplicateSourceInput").value));
  bindOptional("#duplicateTypeInput", "change", (event) => {
    $("#duplicateHint").textContent = event.target.value === "Nachkontrolle"
      ? "Für Nachkontrollen können Planunterlagen oder offene Auflagen bewusst per Checkbox übernommen werden. Automatisch wird nichts Planbezogenes übernommen."
      : "Planunterlagen, Pins, Fotos, Ergebnis und Unterschriften werden standardmäßig nicht übernommen.";
  });
  bindOptional("#cancelPlanImportBtn", "click", () => $("#planImportDialog").close());
  bindOptional("#confirmPlanImportBtn", "click", importSelectedPlans);
  bindOptional("#planImportSourceInput", "change", renderPlanImportOptions);
  bindOptional("#saveMasterDataBtn", "click", () => saveMasterData());
  bindOptional("#saveLeaveMasterDataBtn", "click", () => {
    $("#unsavedMasterDataDialog").close("save");
    state.pendingMasterDataLeaveResolve?.("save");
    state.pendingMasterDataLeaveResolve = null;
  });
  bindOptional("#discardMasterDataBtn", "click", () => {
    $("#unsavedMasterDataDialog").close("discard");
    state.pendingMasterDataLeaveResolve?.("discard");
    state.pendingMasterDataLeaveResolve = null;
  });
  bindOptional("#cancelLeaveMasterDataBtn", "click", () => {
    $("#unsavedMasterDataDialog").close("cancel");
    state.pendingMasterDataLeaveResolve?.("cancel");
    state.pendingMasterDataLeaveResolve = null;
  });
  bindOptional("#unsavedMasterDataDialog", "cancel", (event) => {
    event.preventDefault();
    $("#unsavedMasterDataDialog").close("cancel");
    state.pendingMasterDataLeaveResolve?.("cancel");
    state.pendingMasterDataLeaveResolve = null;
  });
  bindOptional("#unsavedMasterDataDialog", "close", (event) => {
    if (state.pendingMasterDataLeaveResolve) {
      state.pendingMasterDataLeaveResolve(event.target.returnValue || "cancel");
      state.pendingMasterDataLeaveResolve = null;
    }
  });
  bindOptional("#pinModeBtn", "click", () => {
    if (!selectedPlan()) return alert("Bitte zuerst einen Plan hinzufügen.");
    if (!isPlanRenderable(selectedPlan())) return alert("Bitte zuerst einen Plan laden.");
    state.pinMode = !state.pinMode;
    if (state.pinMode) state.placementModePinId = "";
    renderPlanControls();
  });
  bindOptional("#zoomOutBtn", "click", () => changeZoom(-0.25));
  bindOptional("#zoomInBtn", "click", () => changeZoom(0.25));
  bindOptional("#zoomResetBtn", "click", () => setPlanZoom(1));
  bindOptional("#zoomFitBtn", "click", fitPlanToView);
  bindOptional("#rotateLeftBtn", "click", () => setPlanRotation(-90));
  bindOptional("#rotateRightBtn", "click", () => setPlanRotation(90));
  bindOptional("#rotateHalfBtn", "click", () => setPlanRotation(180));
  bindOptional("#planTopBtn", "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  bindOptional("#markBackBtn", "click", closePlanMarkDialog);
  bindOptional("#markPinBtn", "click", () => {
    state.mark.movePinId = "";
    state.mark.active = true;
    hideMarkPinSheet();
    renderMarkSelectors();
    renderMarkPins();
  });
  bindOptional("#markZoomOutBtn", "click", () => setMarkZoom((state.mark.zoom || 1) / 1.25));
  bindOptional("#markZoomInBtn", "click", () => setMarkZoom((state.mark.zoom || 1) * 1.25));
  bindOptional("#markZoomResetBtn", "click", () => setMarkZoom(1));
  bindOptional("#markFitBtn", "click", fitMarkPlan);
  bindOptional("#markPlanSelect", "change", (event) => {
    state.mark.planId = event.target.value;
    state.mark.pageNumber = 1;
    state.mark.zoom = 1;
    state.mark.panX = 0;
    state.mark.panY = 0;
    state.mark.movePinId = "";
    state.mark.active = false;
    renderMarkSelectors();
    renderMarkPlan();
  });
  bindOptional("#markPageSelect", "change", (event) => {
    state.mark.pageNumber = Number(event.target.value) || 1;
    state.mark.panX = 0;
    state.mark.panY = 0;
    state.mark.movePinId = "";
    state.mark.active = false;
    renderMarkSelectors();
    renderMarkPlan();
  });
  bindOptional("#planMarkDialog", "cancel", (event) => {
    event.preventDefault();
    closePlanMarkDialog();
  });
  bindOptional("#closeReportBtn", "click", () => $("#reportDialog").close());
  bindOptional("#reportDialog", "close", () => document.body.classList.remove("report-open"));
  bindOptional("#reportReadModeBtn", "click", () => setReportPreviewMode("read"));
  bindOptional("#reportA4ModeBtn", "click", () => setReportPreviewMode("a4"));
  bindOptional("#downloadReportPdfBtn", "click", savePdfFromA4ReportWithPhotoWarning);
  bindOptional("#shareReportBtn", "click", triggerSavedPdfSharePicker);
  bindOptional("#copyWhatsappTextBtn", "click", shareReportText);
  bindOptional("#saveReportHtmlBtn", "click", saveReportHtml);
  bindOptional("#printReportBtn", "click", () => {
    if (typeof window.print === "function") {
      savePdfFromA4Report();
    } else {
      alert("Bitte über Browser-Menü Drucken / Als PDF speichern verwenden.");
    }
  });
  bindOptional("#planSelect", "change", (event) => switchPlan(event.target.value));
  bindOptional("#pageSelect", "change", (event) => {
    const plan = selectedPlan();
    if (!plan) return;
    plan.currentPage = Number(event.target.value);
    state.selectedPinId = currentPins()[0]?.id || "";
    state.pinMode = false;
    state.placementModePinId = "";
    saveFromForm();
    renderPlan();
    renderPinEditor();
  });
  bindOptional("#planInput", "change", (event) => {
    handlePlanFiles(Array.from(event.target.files));
    event.target.value = "";
  });
  bindOptional("#photoCameraBtn", "click", () => {
    const input = $("#photoCameraInput");
    input.value = "";
    input.click();
  });
  bindOptional("#photoGalleryBtn", "click", () => {
    const input = $("#photoGalleryInput");
    input.value = "";
    input.click();
  });
  bindOptional("#photoCameraInput", "change", async (event) => {
    state.photoTarget = { ...(state.photoTarget || {}), source: "camera" };
    await addPhotos(Array.from(event.target.files));
    event.target.value = "";
  });
  bindOptional("#photoGalleryInput", "change", async (event) => {
    state.photoTarget = { ...(state.photoTarget || {}), source: "gallery" };
    await addPhotos(Array.from(event.target.files));
    event.target.value = "";
  });
  bindOptional("#overviewCameraInput", "change", async (event) => {
    try {
      state.photoTarget = { kind: "overview", id: state.current?.id || "", source: "camera" };
      await addPhotos(Array.from(event.target.files || []));
    } catch (error) {
      console.error(error);
      alert("Foto konnte nicht geöffnet oder gespeichert werden.");
    } finally {
      event.target.value = "";
    }
  });
  bindOptional("#overviewGalleryInput", "change", async (event) => {
    try {
      state.photoTarget = { kind: "overview", id: state.current?.id || "", source: "gallery" };
      await addPhotos(Array.from(event.target.files || []));
    } catch (error) {
      console.error(error);
      alert("Foto konnte nicht geöffnet oder gespeichert werden.");
    } finally {
      event.target.value = "";
    }
  });
  bindOptional("#cancelBarCountBtn", "click", () => $("#barCountDialog").close());
  bindOptional("#saveBarCountBtn", "click", saveBarCountAnalysis);
  bindOptional("#weatherBtn", "click", fetchWeather);
  bindOptional("#inspectionNowBtn", "click", () => {
    const field = $('[name="inspectionDateTime"]');
    if (field) {
      field.value = nowLocalInput();
      saveFromForm();
      showAppToast("Uhrzeit der Abnahme gesetzt.", { type: "success" });
    }
  });
  bindOptional("#exportJsonBtn", "click", exportJson);
  bindOptional("#exportFullBackupBtn", "click", exportFullBackup);
  bindOptional("#importFullBackupBtn", "click", () => $("#fullBackupInput").click());
  bindOptional("#fullBackupInput", "change", (event) => importFullBackup(event.target.files?.[0]));
  bindOptional("#exportProjectPackageBtn", "click", exportProjectPackage);
  bindOptional("#importProjectPackageBtn", "click", () => $("#projectPackageInput").click());
  bindOptional("#projectPackageInput", "change", (event) => importProjectPackage(event.target.files?.[0]));
  bindOptional("#defaultInspector", "input", (event) => { state.settings.defaultInspector = event.target.value; persist(); });
  bindOptional("#defaultCompany", "input", (event) => { state.settings.defaultCompany = event.target.value; persist(); });
  bindOptional("#dropboxBaseFolder", "input", (event) => { state.settings.dropboxBaseFolder = event.target.value; persist(); });
  bindOptional("#dropboxPlanFolder", "input", (event) => { state.settings.dropboxPlanFolder = event.target.value || "Pläne"; persist(); });
  bindOptional("#dropboxPhotoFolder", "input", (event) => { state.settings.dropboxPhotoFolder = event.target.value || "Fotos"; persist(); });
  bindOptional("#dropboxReportFolder", "input", (event) => { state.settings.dropboxReportFolder = event.target.value || "Berichte"; persist(); });
  bindOptional("#translationEnabled", "change", (event) => { state.settings.translationEnabled = !!event.target.checked; persist(); });
  bindOptional("#translationEndpointUrl", "input", (event) => { state.settings.translationEndpointUrl = event.target.value || ""; persist(); });
  bindOptional("#translationDefaultDirection", "change", (event) => { state.settings.translationDefaultDirection = event.target.value || "auto"; persist(); });
  bindOptional("#storageCheckBtn", "click", checkStorage);
  bindOptional("#reloadDataInventoryBtn", "click", reloadDataInventoryFromDb);
  bindOptional("#clearAllBtn", "click", () => {
    if (confirm("Wirklich alle lokalen Testdaten löschen?")) {
      state.protocols = [];
      state.projects = [];
      state.masterData = normalizeMasterData();
      state.current = null;
      clearAllData().then(() => {
        renderList();
        showView("homeView");
      });
    }
  });
}

async function deleteProtocol(protocolId) {
  state.protocols = state.protocols.filter((p) => p.id !== protocolId);
  await idbDelete("protocols", protocolId);
  for (const plan of await idbGetAll("plans")) {
    if (plan.protocolId === protocolId) await idbDelete("plans", plan.id);
  }
  for (const photo of await idbGetAll("photos")) {
    if (photo.protocolId === protocolId) await idbDelete("photos", photo.id);
  }
  if (state.current?.id === protocolId) {
    state.current = null;
    showView("listView");
  }
}

async function deletePlanById(planId) {
  if (!state.current || !planId) return;
  if (!state.current.plans.some((plan) => plan.id === planId)) {
    showAppToast("Zentrale Projektpläne bitte in der Projektzentrale verwalten.", { type: "info" });
    return;
  }
  state.current.plans = state.current.plans.filter((plan) => plan.id !== planId);
  const removedPinIds = state.current.pins
    .filter((pin) => pinPlacements(pin).some((placement) => placement.planId === planId))
    .map((pin) => pin.id);
  state.current.pins = state.current.pins.filter((pin) => !removedPinIds.includes(pin.id));
  state.current.checkpoints.forEach((check) => {
    if (check.pinId && removedPinIds.includes(check.pinId)) check.pinId = "";
    check.samples.forEach((sample) => {
      if (sample.pinId && removedPinIds.includes(sample.pinId)) {
        sample.pinId = "";
        sample.planId = "";
        sample.pageNumber = 1;
      }
    });
  });
  await idbDelete("plans", planId);
  const remainingPlans = plansForCurrentProtocol();
  state.selectedPlanId = remainingPlans[0]?.id || "";
  state.current.activePlanId = state.selectedPlanId;
  await persist();
  renderPlanControls();
  renderPlan();
  renderChecklist();
}

function removePinFromSample(sampleId) {
  const sample = findSample(sampleId);
  if (!sample?.pinId) return;
  const pinId = sample.pinId;
  const pin = state.current.pins.find((item) => item.id === pinId);
  if (pin?.sampleId === sample.id) {
    state.current.pins = state.current.pins.filter((item) => item.id !== pinId);
  }
  sample.pinId = "";
  sample.planId = "";
  sample.pageNumber = 1;
  if (sample.overlapCheck) {
    sample.overlapCheck.pinId = "";
    sample.overlapCheck.planId = "";
    sample.overlapCheck.pageNumber = 1;
  }
  persist();
  renderChecklist();
  renderPlan();
}

async function deleteProject(projectId) {
  const acceptanceIds = protocolsForProject(projectId).map((protocol) => protocol.id);
  for (const id of acceptanceIds) await deleteProtocol(id);
  state.projects = state.projects.filter((project) => project.id !== projectId);
  await idbDelete("projects", projectId);
  if (state.currentProjectId === projectId) state.currentProjectId = "";
  await persist();
}

function openDuplicateDialog(protocolId) {
  const source = state.protocols.find((protocol) => protocol.id === protocolId);
  if (!source) return;
  $("#duplicateSourceInput").value = protocolId;
  $("#duplicateTitleInput").value = `Kopie ${acceptanceLabel(source)}`.trim();
  const typeInput = $("#duplicateTypeInput");
  typeInput.innerHTML = (state.masterData?.acceptanceTypes || DEFAULT_MASTER_DATA.acceptanceTypes).map((value) => `<option>${escapeHtml(value)}</option>`).join("");
  typeInput.value = source.head.acceptanceType || "Erstabnahme";
  $("#duplicateComponentInput").value = source.head.component || "";
  $("#duplicateFloorInput").value = source.head.floor || "";
  $("#duplicateAreaInput").value = source.head.areaAxes || "";
  ["dupHeadInput", "dupChecklistInput"].forEach((id) => $(`#${id}`).checked = true);
  ["dupPlansInput", "dupSamplesInput", "dupPinsInput", "dupPhotosInput", "dupResultInput", "dupSignaturesInput"].forEach((id) => $(`#${id}`).checked = false);
  $("#duplicateHint").textContent = "Planunterlagen, Pins, Fotos, Ergebnis und Unterschriften werden standardmäßig nicht übernommen.";
  $("#duplicateDialog").showModal();
}

function duplicateDialogOptions() {
  return {
    includeHead: $("#dupHeadInput").checked,
    includeChecklist: $("#dupChecklistInput").checked,
    includePlans: $("#dupPlansInput").checked,
    includeSamples: $("#dupSamplesInput").checked,
    includePins: $("#dupPinsInput").checked,
    includePhotos: $("#dupPhotosInput").checked,
    includeResult: $("#dupResultInput").checked,
    includeSignatures: $("#dupSignaturesInput").checked
  };
}

async function duplicateSelectedPlanRecords(source, target, selectedIds = null) {
  const plans = [];
  const planIdMap = new Map();
  const allowed = selectedIds ? new Set(selectedIds) : null;
  for (const sourcePlan of source.plans || []) {
    if (allowed && !allowed.has(sourcePlan.id)) continue;
    const plan = {
      ...JSON.parse(JSON.stringify(sourcePlan)),
      id: uid("plan"),
      number: plans.length + 1,
      currentPage: 1,
      zoom: 1,
      fileSize: sourcePlan.fileSize || 0,
      renderStatus: "idle",
      renderError: ""
    };
    delete plan.objectUrl;
    delete plan.renderedPages;
    plans.push(plan);
    planIdMap.set(sourcePlan.id, plan.id);
    const record = await idbGet("plans", sourcePlan.id);
    if (record?.blob) {
      plan.fileSize = record.blob.size || record.fileSize || plan.fileSize || 0;
      await idbPut("plans", {
        ...record,
        id: plan.id,
        projectId: target.projectId,
        acceptanceId: target.id,
        protocolId: target.id,
        fileName: plan.fileName,
        fileType: plan.type,
        fileSize: plan.fileSize,
        planName: plan.title,
        planNumber: plan.planNumber,
        planDate: plan.planDate,
        planIndex: plan.planIndex || "",
        autoMetaStatus: plan.autoMetaStatus || "",
        planDateCandidates: plan.planDateCandidates || [],
        pageCount: plan.pageCount,
        renderStatus: "",
        renderError: ""
      });
    }
  }
  return { plans, planIdMap };
}

async function duplicatePlanRecords(source, target) {
  return (await duplicateSelectedPlanRecords(source, target)).plans;
}

function cloneChecklistStructure(source, options, maps) {
  const sourceChecks = options.includeChecklist ? source.checkpoints : CHECK_ITEMS.map((title, index) => ({ id: `default-${index}`, title, samples: [] }));
  return sourceChecks.map((check, index) => {
    const newCheck = {
      id: uid(`check-${index}`),
      title: check.title || CHECK_ITEMS[index] || `Prüfpunkt ${index + 1}`,
      status: "offen / nicht bewertet",
      note: "",
      pinId: "",
      photos: [],
      samples: []
    };
    maps.checkIds.set(check.id, newCheck.id);
    if (options.includeSamples) {
      newCheck.samples = (check.samples || []).map((sample, sampleIndex) => {
        const newSample = normalizeSample({
          ...JSON.parse(JSON.stringify(sample)),
          id: uid("sample"),
          checkItemId: newCheck.id,
          number: sampleIndex + 1,
          planId: options.includePlans ? maps.planIds.get(sample.planId) || "" : "",
          pinId: options.includePins ? maps.pinIds.get(sample.pinId) || "" : "",
          photos: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, newCheck.id, sampleIndex + 1);
        maps.sampleIds.set(sample.id, newSample.id);
        return newSample;
      });
      updateCheckStatus(newCheck);
    }
    return newCheck;
  });
}

async function duplicateProtocolPhotos(source, target, maps) {
  const cloneRefs = async (refs, link) => {
    const output = [];
    for (const ref of refs || []) {
      const record = await idbGet("photos", ref.id);
      if (!record?.blob) continue;
      const id = uid("photo");
      await idbPut("photos", { ...record, id, projectId: target.projectId, acceptanceId: target.id, protocolId: target.id, ...link });
      output.push({ ...ref, id });
    }
    return output;
  };
  for (const sourcePin of source.pins || []) {
    const targetPin = target.pins.find((pin) => pin.id === maps.pinIds.get(sourcePin.id));
    if (targetPin) targetPin.photos = await cloneRefs(sourcePin.photos, { pinId: targetPin.id, checkItemId: "", sampleId: "" });
  }
  for (const sourceCheck of source.checkpoints || []) {
    const targetCheck = target.checkpoints.find((check) => check.id === maps.checkIds.get(sourceCheck.id));
    if (!targetCheck) continue;
    targetCheck.photos = await cloneRefs(sourceCheck.photos, { pinId: "", checkItemId: targetCheck.id, sampleId: "" });
    for (const sourceSample of sourceCheck.samples || []) {
      const targetSample = targetCheck.samples.find((sample) => sample.id === maps.sampleIds.get(sourceSample.id));
      if (targetSample) targetSample.photos = await cloneRefs(sourceSample.photos, { pinId: "", checkItemId: targetCheck.id, sampleId: targetSample.id });
    }
  }
}

async function duplicateProtocol(protocolId, options = duplicateDialogOptions()) {
  const source = state.protocols.find((protocol) => protocol.id === protocolId);
  if (!source) return;
  const project = projectById(source.projectId);
  const copy = blankProtocol(project, { head: options.includeHead ? source.head : {} });
  copy.head.acceptanceTitle = $("#duplicateTitleInput").value.trim() || `Kopie ${acceptanceLabel(source)}`;
  copy.head.acceptanceType = $("#duplicateTypeInput").value || "Erstabnahme";
  copy.head.component = $("#duplicateComponentInput").value.trim();
  copy.head.floor = $("#duplicateFloorInput").value.trim();
  copy.head.areaAxes = $("#duplicateAreaInput").value.trim();
  copy.head.createdAt = nowLocalInput();
  copy.weather.weatherDateTime = copy.head.createdAt;
  const maps = { planIds: new Map(), pinIds: new Map(), checkIds: new Map(), sampleIds: new Map() };
  if (options.includePlans) {
    const duplicated = await duplicateSelectedPlanRecords(source, copy);
    copy.plans = duplicated.plans;
    maps.planIds = duplicated.planIdMap;
    copy.activePlanId = copy.plans[0]?.id || "";
  } else {
    copy.plans = [];
    copy.activePlanId = "";
  }
  if (options.includePins && options.includePlans) {
    copy.pins = (source.pins || []).map((pin) => {
      const newPin = {
        ...JSON.parse(JSON.stringify(pin)),
        id: uid("pin"),
        planId: maps.planIds.get(pin.planId) || "",
        photos: [],
        placements: pinPlacements(pin).map((placement) => ({
          ...placement,
          id: uid("placement"),
          planId: maps.planIds.get(placement.planId) || "",
          pageNumber: placement.pageNumber || 1
        })).filter((placement) => placement.planId)
      };
      maps.pinIds.set(pin.id, newPin.id);
      return newPin;
    }).filter((pin) => pin.planId || pin.placements.length);
  } else {
    copy.pins = [];
  }
  copy.checkpoints = cloneChecklistStructure(source, options, maps);
  copy.result = options.includeResult ? { ...JSON.parse(JSON.stringify(source.result || {})) } : {
    resultStatus: "Zur Betonage freigegeben",
    finalNote: "",
    inspectorName: state.settings.defaultInspector || source.result?.inspectorName || "",
    signatureText: ""
  };
  copy.signatures = options.includeSignatures ? (source.signatures || []).map((signature) => normalizeSignature({ ...JSON.parse(JSON.stringify(signature)), id: uid("sig") })) : [];
  copy.photos = [];
  if (options.includePhotos) await duplicateProtocolPhotos(source, copy, maps);
  state.protocols.unshift(normalizeProtocol(copy));
  state.currentProjectId = copy.projectId;
  await persist();
  $("#duplicateDialog")?.close();
  openProtocol(copy);
}


async function createFollowupFromOpenPoints(protocolId) {
  const source = state.protocols.find((protocol) => protocol.id === protocolId);
  if (!source) return;
  if (isFollowupProtocol(source)) {
    alert("Aus einer Nachbegehung wird keine weitere Nachbegehung erstellt. Bitte die ursprüngliche Abnahme verwenden.");
    return;
  }
  const items = sampleIssues(source);
  if (!items.length) {
    alert("Keine offenen Punkte, Auflagen oder Mängel für eine Nachbegehung gefunden.");
    return;
  }
  const project = projectById(source.projectId);
  const createdAt = nowLocalInput();
  const copy = blankProtocol(project, {
    head: source.head,
    type: "followup",
    parentProtocolId: source.id,
    followupCreatedAt: new Date().toISOString()
  });
  copy.type = "followup";
  copy.parentProtocolId = source.id;
  copy.followupCreatedAt = new Date().toISOString();
  copy.head.acceptanceTitle = `Nachbegehung ${source.head.acceptanceTitle || source.head.component || acceptanceLabel(source)}`;
  copy.head.acceptanceType = "Nachbegehung / Nachkontrolle";
  copy.head.acceptanceTypeId = "Nachbegehung / Nachkontrolle";
  copy.head.acceptanceTypeSnapshot = { value: "Nachbegehung / Nachkontrolle", label: "Nachbegehung / Nachkontrolle" };
  copy.head.createdAt = createdAt;
  copy.weather.weatherDateTime = createdAt;
  copy.result = {
    resultStatus: "Nachkontrolle nicht abschließend möglich",
    finalNote: `Nachbegehung zu Abnahme vom ${formatDate(source.head?.createdAt || source.createdAt)}.`,
    inspectorName: source.result?.inspectorName || state.settings.defaultInspector || "",
    signatureText: ""
  };
  const relevantPinIds = new Set(items.map(({ sample }) => sample.pinId).filter(Boolean));
  const relevantPlanIds = new Set();
  items.forEach(({ sample }) => {
    if (sample.planId) relevantPlanIds.add(sample.planId);
    const pin = source.pins.find((item) => item.id === sample.pinId);
    pinPlacements(pin).forEach((placement) => relevantPlanIds.add(placement.planId));
  });
  const maps = { planIds: new Map(), pinIds: new Map(), checkIds: new Map(), sampleIds: new Map() };
  if (relevantPlanIds.size) {
    const duplicated = await duplicateSelectedPlanRecords(source, copy, [...relevantPlanIds]);
    copy.plans = duplicated.plans;
    maps.planIds = duplicated.planIdMap;
    copy.activePlanId = copy.plans[0]?.id || "";
  } else {
    copy.plans = [];
    copy.activePlanId = "";
  }
  copy.pins = (source.pins || [])
    .filter((pin) => relevantPinIds.has(pin.id))
    .map((pin) => {
      const newPin = {
        ...JSON.parse(JSON.stringify(pin)),
        id: uid("pin"),
        planId: maps.planIds.get(pin.planId) || "",
        photos: (pin.photos || []).map(normalizePhotoRef),
        placements: pinPlacements(pin).map((placement) => ({
          ...placement,
          id: uid("placement"),
          planId: maps.planIds.get(placement.planId) || "",
          pageNumber: placement.pageNumber || 1
        })).filter((placement) => placement.planId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      maps.pinIds.set(pin.id, newPin.id);
      return newPin;
    })
    .filter((pin) => pin.planId || pin.placements.length);
  copy.checkpoints = [];
  source.checkpoints.forEach((sourceCheck) => {
    const checkItems = items.filter(({ check }) => check.id === sourceCheck.id);
    if (!checkItems.length) return;
    const newCheck = {
      id: uid("check-followup"),
      title: sourceCheck.title,
      active: true,
      manuallyActivated: true,
      status: "teilweise / Auflage",
      note: "",
      pinId: "",
      photos: [],
      samples: []
    };
    maps.checkIds.set(sourceCheck.id, newCheck.id);
    checkItems.forEach(({ sample }, sampleIndex) => {
      const oldPin = source.pins.find((pin) => pin.id === sample.pinId);
      const mappedPinId = maps.pinIds.get(sample.pinId) || "";
      const mappedPlanId = maps.planIds.get(sample.planId || oldPin?.planId || "") || "";
      const newSample = normalizeSample({
        id: uid("sample"),
        checkItemId: newCheck.id,
        number: sampleIndex + 1,
        location: sample.location || "",
        status: "weiterhin offen",
        note: "",
        planId: mappedPlanId,
        pageNumber: sample.pageNumber || oldPin?.pageNumber || 1,
        pinId: mappedPinId,
        photos: [],
        referencePhotos: (sample.photos || []).map(normalizePhotoRef),
        sourceStatus: initialSampleStatus(sample),
        sourceNote: sample.note || sample.overlapCheck?.generatedText || "",
        sourcePinId: sample.pinId || "",
        sourcePlanId: sample.planId || oldPin?.planId || "",
        sourcePageNumber: sample.pageNumber || oldPin?.pageNumber || 1,
        followupStatus: "weiterhin offen",
        followupNote: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, newCheck.id, sampleIndex + 1);
      maps.sampleIds.set(sample.id, newSample.id);
      newCheck.samples.push(newSample);
      const newPin = copy.pins.find((pin) => pin.id === mappedPinId);
      if (newPin) {
        newPin.checkItemId = newCheck.id;
        newPin.sampleId = newSample.id;
        newPin.title = newPin.title || `${sourceCheck.title} · ${sample.location || `Prüfstelle ${sample.number}`}`;
      }
    });
    updateCheckStatus(newCheck);
    copy.checkpoints.push(newCheck);
  });
  copy.signatures = [];
  copy.overviewPhotos = [];
  copy.photos = [];
  state.protocols.unshift(normalizeProtocol(copy));
  state.currentProjectId = copy.projectId;
  await persist();
  openProtocol(copy);
  showAppToast("Nachbegehung erstellt. Die ursprüngliche Abnahme bleibt unverändert.");
}

function openPlanImportDialog() {
  if (!state.current) return;
  const sources = protocolsForProject(state.current.projectId).filter((protocol) => protocol.id !== state.current.id && protocol.plans?.length);
  const sourceSelect = $("#planImportSourceInput");
  sourceSelect.innerHTML = sources.length
    ? sources.map((protocol) => `<option value="${protocol.id}">${escapeHtml(acceptanceLabel(protocol))} (${protocol.plans.length} Plan/Pläne)</option>`).join("")
    : `<option value="">Keine Abnahme mit Planunterlagen vorhanden</option>`;
  renderPlanImportOptions();
  $("#planImportDialog").showModal();
}

function renderPlanImportOptions() {
  const source = state.protocols.find((protocol) => protocol.id === $("#planImportSourceInput").value);
  const wrap = $("#planImportOptions");
  if (!source?.plans?.length) {
    wrap.innerHTML = `<p class="muted">Keine Planunterlagen auswählbar.</p>`;
    return;
  }
  wrap.innerHTML = source.plans.map((plan) => `
    <label>
      <input type="checkbox" data-import-plan="${plan.id}" checked>
      ${escapeHtml(plan.planNumber || plan.fileName || "Plan")} ${plan.title ? "– " + escapeHtml(plan.title) : ""}
    </label>
  `).join("");
}

async function importSelectedPlans() {
  if (!state.current) return;
  const source = state.protocols.find((protocol) => protocol.id === $("#planImportSourceInput").value);
  if (!source) return alert("Bitte eine Abnahme als Quelle auswählen.");
  const selectedIds = $$("[data-import-plan]:checked").map((input) => input.dataset.importPlan);
  if (!selectedIds.length) return alert("Bitte mindestens einen Plan auswählen.");
  saveFromForm();
  const duplicated = await duplicateSelectedPlanRecords(source, state.current, selectedIds);
  const startNumber = state.current.plans.length;
  duplicated.plans.forEach((plan, index) => {
    plan.number = startNumber + index + 1;
    state.current.plans.push(plan);
  });
  state.selectedPlanId = duplicated.plans[0]?.id || state.selectedPlanId;
  state.current.activePlanId = state.selectedPlanId;
  await persist();
  $("#planImportDialog").close();
  renderPlanControls();
  renderPlan();
  renderPinEditor();
}

async function syncPlanRecord(plan) {
  const record = await idbGet("plans", plan.id);
  if (!record) return;
  await idbPut("plans", {
    ...record,
    projectId: state.current?.projectId || record.projectId || "",
    acceptanceId: state.current?.id || record.acceptanceId || record.protocolId || "",
    protocolId: state.current?.id || record.protocolId || "",
    fileName: plan.fileName,
    fileType: plan.type,
    fileSize: plan.fileSize || record.fileSize || 0,
    planName: plan.title,
    appPlanName: plan.appPlanName || plan.title || "",
    category: plan.category || "Sonstiges",
    floor: plan.floor || "",
    component: plan.component || "",
    planNo: plan.planNo || plan.planNumber || "",
    planNumber: plan.planNumber,
    planDate: plan.planDate,
    planIndex: plan.planIndex || "",
    documentStatus: plan.documentStatus || "verwendet",
    source: plan.source || "uploaded",
    dropboxPath: plan.dropboxPath || "",
    dropboxSharedLink: plan.dropboxSharedLink || "",
    dropboxFileName: plan.dropboxFileName || "",
    dropboxFileId: plan.dropboxFileId || "",
    dropboxRev: plan.dropboxRev || "",
    lastSyncedAt: plan.lastSyncedAt || "",
    lastManualSync: plan.lastManualSync || "",
    syncStatus: plan.syncStatus || (plan.source === "uploaded" ? "not_configured" : "linked"),
    autoMetaStatus: plan.autoMetaStatus || "",
    planDateCandidates: plan.planDateCandidates || [],
    remark: plan.remark,
    pageCount: plan.pageCount,
    renderStatus: plan.renderStatus || "",
    renderError: plan.renderError || ""
  });
}

async function clearAllData() {
  await Promise.all([idbClear("projects"), idbClear("protocols"), idbClear("masterData"), idbClear("plans"), idbClear("photos")]);
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  state.pdfDocs.clear();
  state.pdfPageCache.clear();
  for (const url of state.objectUrls.values()) URL.revokeObjectURL(url);
  state.objectUrls.clear();
}

async function collectDataInventory() {
  const protocols = (await idbGetAll("protocols")).map(normalizeProtocol);
  const projects = (await idbGetAll("projects")).map(normalizeProject);
  const masterData = normalizeMasterData(await idbGet("masterData", "app"));
  const plans = await idbGetAll("plans");
  const photos = await idbGetAll("photos");
  const rebar = protocols.filter((protocol) => !isSiteControlProtocol(protocol) && !isDailyReportProtocol(protocol) && !isProjectPlanLibraryProtocol(protocol));
  const followups = protocols.filter((protocol) => protocol.type === "followup");
  const siteControls = protocols.filter(isSiteControlProtocol);
  const dailyReports = protocols.filter(isDailyReportProtocol);
  const pins = protocols.reduce((sum, protocol) => sum + (protocol.pins || []).length, 0);
  const masterEntries = masterData.companies.length + masterData.inspectors.length + masterData.ownPersons.length + masterData.components.length + masterData.floors.length + masterData.acceptanceTypes.length + masterData.areaAxes.length + masterData.signatureRoles.length;
  return {
    projects: projects.length,
    protocols: protocols.length,
    rebar: rebar.length,
    followups: followups.length,
    siteControls: siteControls.length,
    dailyReports: dailyReports.length,
    plans: plans.length,
    pins,
    photos: photos.length,
    masterEntries,
    masterData,
    stores: Array.from(state.db?.objectStoreNames || []),
    dbName: DB_NAME,
    dbVersion: DB_VERSION,
    appVersion: APP_VERSION
  };
}

async function checkStorage() {
  try {
    const info = await collectDataInventory();
    $("#storageCheckResult").innerHTML = `
      <strong>Datenbestand</strong><br>
      ${info.projects} Projekt(e) · ${info.rebar} Bewehrungsabnahme(n) · ${info.followups} Nachbegehung(en) · ${info.siteControls} Baustellenkontrolle(n) · ${info.dailyReports} Bautagesbericht(e)<br>
      ${info.plans} Plan-Datei(en) · ${info.pins} Pin(s) · ${info.photos} Foto(s) · ${info.masterEntries} Stammdaten-Eintrag(e)<br>
      DB: ${escapeHtml(info.dbName)} v${info.dbVersion} · Stores: ${escapeHtml(info.stores.join(", "))}<br>
      App: ${escapeHtml(info.appVersion)} · letzte Stammdaten-Speicherung: ${info.masterData.lastSavedAt ? escapeHtml(formatDate(info.masterData.lastSavedAt)) : "noch nicht manuell gespeichert"}
    `;
  } catch (error) {
    $("#storageCheckResult").textContent = `IndexedDB verfügbar: nein oder fehlerhaft (${error?.message || error}).`;
  }
}

async function reloadDataInventoryFromDb() {
  try {
    await load({ persistRepairs: false });
    state.current = state.current ? state.protocols.find((protocol) => protocol.id === state.current.id) || null : null;
    renderHomeProjects();
    if ($("#projectDirectoryView")?.classList.contains("active")) renderProjectDirectory();
    if ($("#projectHubView")?.classList.contains("active")) renderProjectHub();
    if ($("#listView")?.classList.contains("active")) renderList();
    if ($("#siteControlView")?.classList.contains("active")) renderSiteControlView();
    if ($("#dailyReportView")?.classList.contains("active")) renderDailyReportView();
    renderDatalists();
    if ($("#masterDataView")?.classList.contains("active")) renderMasterData();
    if ($("#settingsView")?.classList.contains("active")) await checkStorage();
    showAppToast("Datenbestand neu aus IndexedDB geladen.", { type: "success" });
  } catch (error) {
    console.error("Datenbestand neu laden fehlgeschlagen", error);
    showStorageWarning(`Datenbestand konnte nicht neu geladen werden: ${error?.message || error}`);
  }
}

function changeZoom(delta) {
  const plan = selectedPlan();
  if (!plan) return;
  setPlanZoom((plan.zoom || 1) + delta);
}

function setPlanZoom(zoom, originClientX, originClientY) {
  const plan = selectedPlan();
  if (!plan) return;
  const wrap = $(".plan-viewer");
  const stage = $("#planStage");
  const oldWidth = stage.offsetWidth || stage.getBoundingClientRect().width || 1;
  const oldHeight = stage.offsetHeight || stage.getBoundingClientRect().height || 1;
  const wrapRect = wrap.getBoundingClientRect();
  const originX = originClientX ?? (wrapRect.left + wrapRect.width / 2);
  const originY = originClientY ?? (wrapRect.top + wrapRect.height / 2);
  const currentPanX = Number(plan.panX) || 0;
  const currentPanY = Number(plan.panY) || 0;
  const relX = (originX - wrapRect.left - currentPanX) / oldWidth;
  const relY = (originY - wrapRect.top - currentPanY) / oldHeight;
  plan.zoom = Math.min(5, Math.max(0.5, zoom));
  applyCurrentPlanZoom();
  $("#zoomLabel").textContent = `${Math.round((plan.zoom || 1) * 100)} %`;
  scheduleZoomPersist();
  requestAnimationFrame(() => {
    const newWidth = stage.offsetWidth || stage.getBoundingClientRect().width || 1;
    const newHeight = stage.offsetHeight || stage.getBoundingClientRect().height || 1;
    plan.panX = originX - wrapRect.left - relX * newWidth;
    plan.panY = originY - wrapRect.top - relY * newHeight;
    clampPlanPan(plan);
    applyPlanTransform(plan);
  });
}

function applyCurrentPlanZoom() {
  const plan = selectedPlan();
  const target = visiblePlanElement();
  if (!plan || !target) return;
  const naturalWidth = target instanceof HTMLCanvasElement ? target.width : target.naturalWidth;
  if (!naturalWidth) return;
  applyPlanElementSize(target, plan, naturalWidth);
}

function scheduleZoomPersist() {
  window.clearTimeout(state.zoomPersistTimer);
  state.zoomPersistTimer = window.setTimeout(() => persist(), 250);
}

function fitPlanToView() {
  const plan = selectedPlan();
  const target = visiblePlanElement();
  if (!plan || !target) return;
  const wrap = $(".plan-viewer");
  const naturalWidth = target instanceof HTMLCanvasElement ? target.width : target.naturalWidth;
  if (!naturalWidth) return;
  plan.panX = 0;
  plan.panY = 0;
  setPlanZoom(1);
}

function bindPlanGestures() {
  const wrap = $(".plan-viewer");
  wrap.addEventListener("pointerdown", (event) => {
    const plan = selectedPlan();
    if (!plan || !isPlanRenderable(plan)) return;
    if (!event.target.closest(".plan-viewer")) return;
    if (event.target.closest("button, input, textarea, select, summary, label")) return;
    state.touch.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    state.touch.moved = false;
    state.touch.pinTapCandidate = (state.pinMode || !!state.placementModePinId) && !event.target.closest(".pin");
    state.touch.startScrollLeft = wrap.scrollLeft;
    state.touch.startScrollTop = wrap.scrollTop;
    state.touch.startPanX = Number(plan.panX) || 0;
    state.touch.startPanY = Number(plan.panY) || 0;
    state.touch.startX = event.clientX;
    state.touch.startY = event.clientY;
    state.touch.startZoom = plan.zoom || 1;
    state.touch.active = true;
    if (state.touch.pointers.size === 2) {
      const points = Array.from(state.touch.pointers.values());
      state.touch.startDistance = pointerDistance(points[0], points[1]);
      state.touch.pinTapCandidate = false;
      wrap.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      return;
    }
    if (state.touch.pinTapCandidate) {
      wrap.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }
  });
  wrap.addEventListener("pointermove", (event) => {
    if (!state.touch.active || !state.touch.pointers.has(event.pointerId)) return;
    state.touch.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = Array.from(state.touch.pointers.values());
    if (points.length >= 2) {
      if (event.pointerType === "touch" && state.touch.pinchActive) return;
      const distance = pointerDistance(points[0], points[1]);
      const center = pointerCenter(points[0], points[1]);
      if (Math.abs(distance - state.touch.startDistance) > 8) state.touch.moved = true;
      setPlanZoom(state.touch.startZoom * (distance / Math.max(1, state.touch.startDistance)), center.x, center.y);
      event.preventDefault();
      return;
    }
    const dx = event.clientX - state.touch.startX;
    const dy = event.clientY - state.touch.startY;
    if (Math.hypot(dx, dy) > 8) state.touch.moved = true;
    if (state.touch.pinTapCandidate && state.touch.moved) {
      event.preventDefault();
    }
  });
  const finish = (event) => {
    const point = state.touch.pointers.get(event.pointerId) || { x: event.clientX, y: event.clientY };
    state.touch.pointers.delete(event.pointerId);
    if (state.touch.pinTapCandidate && !state.touch.moved && state.touch.pointers.size === 0) {
      addPinAt(point.x, point.y);
    }
    try {
      wrap.releasePointerCapture?.(event.pointerId);
    } catch (_) {}
    if (state.touch.pointers.size === 0) resetPlanTouch();
  };
  wrap.addEventListener("pointerup", finish);
  wrap.addEventListener("pointercancel", finish);
  wrap.addEventListener("lostpointercapture", (event) => {
    state.touch.pointers.delete(event.pointerId);
    if (state.touch.pointers.size === 0) resetPlanTouch();
  });
  wrap.addEventListener("touchstart", (event) => {
    const plan = selectedPlan();
    if (!plan || !isPlanRenderable(plan)) return;
    if (event.touches.length >= 2) {
      const first = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      const second = { x: event.touches[1].clientX, y: event.touches[1].clientY };
      state.touch.pinchActive = true;
      state.touch.moved = false;
      state.touch.pinTapCandidate = false;
      state.touch.pinchStartDistance = pointerDistance(first, second);
      state.touch.pinchStartZoom = plan.zoom || 1;
      event.preventDefault();
    }
  }, { passive: false });
  wrap.addEventListener("touchmove", (event) => {
    if (!state.touch.pinchActive || event.touches.length < 2) return;
    const first = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    const second = { x: event.touches[1].clientX, y: event.touches[1].clientY };
    const distance = pointerDistance(first, second);
    const center = pointerCenter(first, second);
    if (Math.abs(distance - state.touch.pinchStartDistance) > 6) state.touch.moved = true;
    setPlanZoom(state.touch.pinchStartZoom * (distance / Math.max(1, state.touch.pinchStartDistance)), center.x, center.y);
    event.preventDefault();
  }, { passive: false });
  const finishTouchPinch = (event) => {
    if (event.touches?.length >= 2) return;
    state.touch.pinchActive = false;
    state.touch.pinchStartDistance = 0;
    state.touch.pinchStartZoom = selectedPlan()?.zoom || 1;
  };
  wrap.addEventListener("touchend", finishTouchPinch, { passive: true });
  wrap.addEventListener("touchcancel", finishTouchPinch, { passive: true });
  wrap.addEventListener("wheel", (event) => {
    if (!selectedPlan() || !event.ctrlKey) return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.12 : 0.88;
    setPlanZoom((selectedPlan().zoom || 1) * factor, event.clientX, event.clientY);
  }, { passive: false });
}

function resetPlanTouch() {
  state.touch.active = false;
  state.touch.moved = false;
  state.touch.pinTapCandidate = false;
  state.touch.startDistance = 0;
  state.touch.startPanX = 0;
  state.touch.startPanY = 0;
  state.touch.pinchActive = false;
}


function bindMarkGestures() {
  const viewer = $(".mark-viewer");
  if (!viewer) return;
  viewer.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-mark-pin]")) return;
    if (!state.markTarget || event.target.closest("button, input, textarea, select, summary, label")) return;
    state.mark.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (state.mark.pointers.size > 1) {
      const points = Array.from(state.mark.pointers.values());
      state.mark.isPinching = true;
      state.mark.moved = true;
      state.mark.pinchStartDistance = pointerDistance(points[0], points[1]);
      state.mark.pinchStartZoom = state.mark.zoom || 1;
      state.mark.pinchCenter = pointerCenter(points[0], points[1]);
      event.preventDefault();
      return;
    }
    state.mark.startX = event.clientX;
    state.mark.startY = event.clientY;
    state.mark.moved = false;
  });
  viewer.addEventListener("pointermove", (event) => {
    if (!state.mark.pointers.has(event.pointerId)) return;
    state.mark.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (state.mark.pointers.size > 1) {
      const points = Array.from(state.mark.pointers.values());
      const distance = pointerDistance(points[0], points[1]);
      const center = pointerCenter(points[0], points[1]);
      if (state.mark.pinchStartDistance > 0) {
        const nextZoom = state.mark.pinchStartZoom * (distance / state.mark.pinchStartDistance);
        state.mark.isPinching = true;
        state.mark.moved = true;
        setMarkZoom(nextZoom, center.x, center.y);
      }
      event.preventDefault();
      return;
    }
    const dx = event.clientX - state.mark.startX;
    const dy = event.clientY - state.mark.startY;
    if (Math.hypot(dx, dy) > 8) state.mark.moved = true;
  });
  const finish = (event) => {
    const point = state.mark.pointers.get(event.pointerId) || { x: event.clientX, y: event.clientY };
    const wasPinching = state.mark.isPinching;
    const cancelled = event.type === "pointercancel";
    state.mark.pointers.delete(event.pointerId);
    if (state.mark.pointers.size < 2) {
      state.mark.isPinching = false;
      state.mark.pinchStartDistance = 0;
      state.mark.pinchCenter = null;
    }
    if (!cancelled && !wasPinching && state.mark.movePinId && !state.mark.moved && !state.mark.pointers.size) moveMarkPinTo(point.x, point.y);
    else if (!cancelled && !wasPinching && state.mark.active && !state.mark.moved && !state.mark.pointers.size) placeMarkPin(point.x, point.y);
    if (!state.mark.pointers.size) state.mark.moved = false;
  };
  viewer.addEventListener("pointerup", finish);
  viewer.addEventListener("pointercancel", finish);
  viewer.addEventListener("wheel", (event) => {
    if (!state.markTarget) return;
    event.preventDefault();
    setMarkZoom((state.mark.zoom || 1) * (event.deltaY < 0 ? 1.12 : 0.88));
  }, { passive: false });
}

function pointerDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointerCenter(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function switchPlan(planId) {
  state.selectedPlanId = planId;
  state.current.activePlanId = planId;
  const plan = selectedPlan();
  state.selectedPinId = plan ? currentPins()[0]?.id || "" : "";
  state.pinMode = false;
  state.placementModePinId = "";
  saveFromForm();
  renderPlanControls();
  renderPlan();
  renderPinEditor();
}

function normalizeResultPdfActions() {
  const setButton = (selector, html, className = "") => {
    const button = document.querySelector(selector);
    if (!button) return null;
    button.innerHTML = html;
    if (className) button.className = className;
    return button;
  };
  setButton("#pdfSaveBtn", "PDF speichern<br><small>Druckdialog · aus A4-Bericht</small>", "primary-btn");
  setButton("#pdfShareBtn", "Gespeicherte PDF teilen<br><small>PDF auswählen · WhatsApp / Mail / Drive</small>", "secondary-btn");
  setButton("#downloadReportPdfBtn", "PDF speichern<br><small>Druckdialog · aus A4-Bericht</small>", "primary-btn");
  setButton("#shareReportBtn", "Gespeicherte PDF teilen<br><small>PDF auswählen · WhatsApp / Mail / Drive</small>", "secondary-btn");
  setButton("#copyWhatsappTextBtn", "Berichtstext teilen", "secondary-btn");
  const printButton = document.querySelector("#pdfPrintBtn");
  if (printButton) printButton.hidden = true;
  const reportPrintButton = document.querySelector("#printReportBtn");
  if (reportPrintButton) reportPrintButton.hidden = true;
  const actions = document.querySelector(".report-export-actions");
  if (actions && !document.querySelector("#copyReportTextMainBtn")) {
    const button = document.createElement("button");
    button.className = "secondary-btn";
    button.id = "copyReportTextMainBtn";
    button.type = "button";
    button.innerHTML = "Berichtstext teilen<br><small>Kurztext für WhatsApp/Mail</small>";
    const preview = document.querySelector("#pdfPreviewBtn");
    actions.insertBefore(button, preview || null);
  }
  if (!document.querySelector("#savedPdfShareInput")) {
    const input = document.createElement("input");
    input.id = "savedPdfShareInput";
    input.className = "visually-hidden";
    input.type = "file";
    input.accept = "application/pdf";
    document.body.appendChild(input);
  }
}

function updateAppVersionDisplay() {
  document.querySelectorAll("[data-app-version]").forEach((node) => {
    node.textContent = APP_VERSION;
  });
  const target = document.getElementById("appVersionInfo");
  if (target) target.textContent = `Version: ${APP_VERSION} · Cache: ${APP_CACHE}`;
}

function updateDeviceStorageInfo() {
  const target = $("#deviceStorageInfo");
  if (!target) return;
  target.textContent = "Daten werden lokal auf diesem Gerät gespeichert.";
}

async function cacheRuntimeAssets() {
  if (!("caches" in window)) return;
  try {
    const cache = await caches.open(APP_CACHE);
    await cache.addAll([PDFJS_URL, PDFJS_WORKER_URL]);
  } catch {
    // Offline caching is best-effort. The app remains usable; PDF.js will be cached when the browser allows it.
  }
}

async function boot() {
  try {
    await load();
  } catch (error) {
    showStorageWarning(`IndexedDB konnte nicht gestartet werden: ${error.message || error}`);
    return;
  }
  try {
    normalizeResultPdfActions();
    bindEvents();
    bindMarkGestures();
    bindVoice();
    updateAppVersionDisplay();
    updateDeviceStorageInfo();
    renderBrowserWarnings();
    renderHomeProjects();
    renderList();
    renderSiteControlView();
    renderDailyReportView();
    window.addEventListener("resize", updateReportPreviewFrame);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").then(() => cacheRuntimeAssets()).catch(() => {});
    }
  } catch (error) {
    console.error("App-Initialisierung fehlgeschlagen", error);
    showStorageWarning(`App konnte nicht vollständig gestartet werden: ${error.message || error}`);
  }
}

boot();

































































