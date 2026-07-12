const STORAGE_KEY = "kai-bewehrungscheck-protocols-v01";
const SETTINGS_KEY = "kai-bewehrungscheck-settings-v01";
const DB_NAME = "kai-bewehrungscheck-db";
const DB_VERSION = 4;
const PDFJS_VERSION = "3.11.174";
const APP_CACHE = "kai-bewehrungscheck-v67";
const PDFJS_URL = `vendor/pdfjs/pdf.min.js?v=67`;
const PDFJS_WORKER_URL = `vendor/pdfjs/pdf.worker.min.js?v=67`;
const STABLE_TAG = "v52-stable-before-v53";
const STATUSES = ["fertig / OK", "teilweise / Auflage", "nicht OK / Mangel", "nicht relevant"];
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
  signatureRoles: ["Abnehmender / Bewehrungskontrolle", "Verantwortlicher vor Ort", "Polier", "Bauleiter", "Eisenflechter", "Betonbauer", "Prüfingenieur", "Sonstige"]
};

const state = {
  projects: [],
  protocols: [],
  masterData: null,
  masterDataDirty: false,
  pendingMasterDataLeaveResolve: null,
  settings: {},
  currentProjectId: "",
  pendingAcceptanceProjectId: "",
  current: null,
  selectedPlanId: "",
  selectedPinId: "",
  checkScopeOnlyActive: false,
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
    pinTapCandidate: false
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

async function load() {
  state.db = await openDatabase();
  state.projects = (await idbGetAll("projects")).map(normalizeProject);
  state.protocols = (await idbGetAll("protocols")).map(normalizeProtocol);
  state.masterData = normalizeMasterData(await idbGet("masterData", "app"));
  state.settings = await idbGet("settings", "app") || JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  if (!state.protocols.length) {
    await migrateLocalStorageData();
  }
  ensureProjectStructure();
  $("#defaultInspector").value = state.settings.defaultInspector || "";
  $("#defaultCompany").value = state.settings.defaultCompany || "";
  renderDatalists();
  await persist();
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
    signatureRoles: uniqueValues(source.signatureRoles || DEFAULT_MASTER_DATA.signatureRoles)
  };
}

function uniqueValues(values) {
  return Array.from(new Set((values || []).map((value) => String(value || "").trim()).filter(Boolean)));
}

function normalizeAddress(value = {}) {
  if (typeof value === "string") {
    const text = value.trim();
    const match = text.match(/^(.*?)[,\s]+(\d{5})\s+(.+)$/);
    return {
      street: match ? match[1].trim().replace(/,\s*$/, "") : text,
      zip: match ? match[2].trim() : "",
      city: match ? match[3].trim() : "",
      country: "Deutschland"
    };
  }
  return {
    street: value.street || "",
    zip: value.zip || "",
    city: value.city || "",
    country: value.country || "Deutschland"
  };
}

function formatAddress(address, { multiline = true } = {}) {
  const item = normalizeAddress(address);
  const cityLine = [item.zip, item.city].filter(Boolean).join(" ");
  const parts = [item.street, cityLine, item.country && item.country !== "Deutschland" ? item.country : ""].filter(Boolean);
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
    }
    syncProtocolProjectFields(protocol, projectById.get(protocol.projectId), { overwriteProtocol: false });
  }
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
    type: "Bewehrungsabnahme",
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
  syncResultLookupFields(protocol);
  return protocol;
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
  sample.overlapCheck = normalizeOverlapCheck(sample.overlapCheck || sample.overlapCalc || null);
  delete sample.overlapCalc;
  sample.createdAt = sample.createdAt || new Date().toISOString();
  sample.updatedAt = sample.updatedAt || sample.createdAt;
  return sample;
}

function normalizePhotoRef(photo = {}) {
  return {
    id: photo.id || uid("photo"),
    name: photo.name || photo.fileName || "Foto",
    type: photo.type || photo.fileType || "image/jpeg",
    createdAt: photo.createdAt || new Date().toISOString(),
    barCountAnalysis: normalizeBarCountAnalysis(photo.barCountAnalysis)
  };
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
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === id));
  $("#backBtn").classList.toggle("hidden", id === "homeView");
  renderBrowserWarnings();
  if (id === "homeView") renderHomeProjects();
  if (id === "listView") renderList();
  if (id === "masterDataView") {
    renderDatalists();
    renderMasterData();
  }
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

async function navigateToView(id) {
  if (activeViewId() === "masterDataView" && id !== "masterDataView") {
    const canLeave = await confirmLeaveMasterData();
    if (!canLeave) return false;
  }
  showView(id);
  return true;
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

function openProtocol(protocol) {
  state.current = normalizeProtocol(protocol);
  state.currentProjectId = state.current.projectId || "";
  const project = projectById(state.currentProjectId);
  if (project) syncProtocolProjectFields(state.current, project, { overwriteProtocol: false });
  state.selectedPlanId = state.current.activePlanId || state.current.plans[0]?.id || "";
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
  showView("listView");
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
    if (!value) return alert("Bitte zuerst einen Namen oder ein Büro eintragen.");
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
  const acceptances = protocolsForProject(project.id);
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
  renderOverviewPhotos();
  renderSignatures();
}

function renderOverviewPhotos() {
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
        ${comboField({ label: "Zuordnung", field: "category", list: "signatureCategoryOptions", value: signature.category, placeholder: "Kenntnisnahme vor Ort" })}
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

function saveSignature(id) {
  const card = $(`[data-signature="${id}"]`);
  const signature = findSignature(id);
  if (!card || !signature) return;
  $('[data-signature-field]', card).forEach((field) => {
    signature[field.dataset.signatureField] = field.value || "";
  });
  syncSignatureSnapshots(signature);
  const canvas = $(`[data-signature-pad="${id}"]`, card);
  if (canvas && state.signatureEditId === id) signature.signatureData = canvas.toDataURL("image/png");
  signature.signedAt = signature.signedAt || nowLocalInput();
  if (state.signatureEditId === id) state.signatureEditId = "";
  persist();
  renderSignatures();
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
  return state.current?.plans.find((plan) => plan.id === state.selectedPlanId) || null;
}

function acceptanceLabel(protocol) {
  return protocol?.head?.acceptanceTitle || protocol?.head?.component || formatDate(protocol?.head?.createdAt) || "Abnahme";
}



function projectStats(project) {
  const acceptances = protocolsForProject(project.id);
  const latest = acceptances.reduce((value, protocol) => {
    const stamp = protocol.updatedAt || protocol.createdAt || protocol.head?.createdAt || "";
    return stamp > value ? stamp : value;
  }, project.updatedAt || project.createdAt || "");
  return { acceptances, latest };
}

function renderDatalists() {
  const master = normalizeMasterData(state.masterData);
  state.masterData = master;
  setDatalist("companyOptions", companyNames());
  setDatalist("clientOptions", clientNames());
  setDatalist("ownPersonOptions", ownPersonNames());
  setDatalist("personOptions", personNames());
  setDatalist("inspectorOptions", master.inspectors.map(inspectorLabel));
  setDatalist("componentOptions", master.components);
  setDatalist("floorOptions", master.floors);
  setDatalist("acceptanceTypeOptions", master.acceptanceTypes);
  setDatalist("areaOptions", master.areaAxes);
  setDatalist("tradeRoleOptions", tradeRoleOptions());
  setDatalist("signatureCategoryOptions", signatureCategoryOptions());
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

function renderMasterData() {
  const panel = $("#masterDataPanel");
  if (!panel) return;
  const master = normalizeMasterData(state.masterData);
  state.masterData = master;
  updateMasterDataSaveStatus();
  panel.innerHTML = `
    ${masterSection("Eigene Firma / Abnehmende", "ownPersons", master.ownPersons, personMasterFields())}
    ${masterSection("Firmen", "companies", master.companies, companyMasterFields())}
    ${masterSection("Prüfingenieur / Prüfer", "inspectors", master.inspectors, inspectorMasterFields())}
    ${lookupMasterSection("Standard-Bauteile", "components", master.components)}
    ${lookupMasterSection("Standard-Geschosse", "floors", master.floors)}
    ${lookupMasterSection("Standard-Abnahmearten", "acceptanceTypes", master.acceptanceTypes)}
    ${lookupMasterSection("Standard-Bereiche / Achsen", "areaAxes", master.areaAxes)}
    ${lookupMasterSection("Unterschriftenrollen", "signatureRoles", master.signatureRoles)}
  `;
}

function masterSection(title, collection, items, fields) {
  return `
    <section class="panel master-section">
      <div class="section-head">
        <h3>${escapeHtml(title)}</h3>
        <button class="secondary-btn" type="button" data-add-master="${collection}">Neu</button>
      </div>
      <div class="master-items">
        ${items.length ? items.map((item) => masterItemCard(collection, item, fields)).join("") : `<p class="muted">Noch keine Einträge.</p>`}
      </div>
    </section>
  `;
}

function masterItemCard(collection, item, fields) {
  return `
    <article class="master-card" data-master-item="${collection}" data-master-id="${item.id}">
      <div class="grid compact-grid">
        ${fields.map((field) => masterInput(collection, item, field)).join("")}
      </div>
      <button class="danger-btn" type="button" data-delete-master="${collection}" data-master-id="${item.id}">Löschen</button>
    </article>
  `;
}

function masterInput(collection, item, field) {
  const value = getPath(item, field.name) || "";
  if (field.type === "checkbox") {
    return `<label>${escapeHtml(field.label)}<input data-master-field="${field.name}" type="checkbox" ${getPath(item, field.name) ? "checked" : ""}></label>`;
  }
  const zipWarning = field.name.endsWith(".zip") && value && !/^\d{5}$/.test(value)
    ? `<span class="field-warning">PLZ prüfen: deutsche PLZ normalerweise 5-stellig.</span>`
    : "";
  return `<label>${escapeHtml(field.label)}<input data-master-field="${field.name}" value="${escapeAttr(value)}" ${field.required ? "required" : ""} ${field.list ? `list="${field.list}"` : ""}>${zipWarning}</label>`;
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
    { name: "office", label: "Büro" },
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
  if (collection === "companies") master.companies.push({ id: uid("company"), name: "", role: "", contact: "", address: normalizeAddress(), phone: "", email: "", note: "" });
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
        <div class="muted">${escapeHtml(formatDate(p.head.createdAt))} · ${escapeHtml(p.head.acceptanceType || "Erstabnahme")} · ${escapeHtml(p.head.component || "Bauteil offen")}</div>
        <div>${escapeHtml(p.head.areaAxes || p.head.floor || "")}</div>
        <div class="muted">${escapeHtml(p.result?.resultStatus || "Ergebnis offen")} · ${issues} Auflage(n)/Mangel · ${p.pins.length} Pin(s)</div>
        <div class="muted">Zuletzt bearbeitet: ${escapeHtml(formatDate(p.updatedAt || p.createdAt || p.head.createdAt))}</div>
      </div>
      <div class="card-actions">
        <button class="secondary-btn" data-open="${p.id}" type="button">Öffnen</button>
        <button class="secondary-btn" data-duplicate-acceptance="${p.id}" type="button">Duplizieren</button>
        <button class="danger-btn" data-delete="${p.id}" type="button">Abnahme löschen</button>
      </div>
    </article>
  `;
}

function renderHomeProjects() {
  const list = $("#homeProjectList");
  if (!list) return;
  if (!state.projects.length) {
    list.innerHTML = `<div class="panel"><p class="muted">Noch keine Projekte vorhanden.</p></div>`;
    return;
  }
  list.innerHTML = `
    <div class="section-head"><h2>Vorhandene Projekte</h2><button class="small-btn" data-nav="listView" type="button">Alle anzeigen</button></div>
    ${state.projects.slice(0, 5).map((project) => {
      const stats = projectStats(project);
      return `
        <article class="project-card compact-project-card">
          <div>
            <h3>${escapeHtml(project.name || "Unbenanntes Projekt")}</h3>
            <div class="muted">${escapeHtml(formatAddress(project.address || project.siteAddress, { multiline: false }) || "Adresse offen")}</div>
            <div class="muted">${stats.acceptances.length} Abnahme(n) · zuletzt bearbeitet ${escapeHtml(formatDate(stats.latest))}</div>
          </div>
          <div class="card-actions">
            <button class="secondary-btn" data-open-project="${project.id}" type="button">Projekt öffnen</button>
            <button class="secondary-btn" data-edit-project="${project.id}" type="button">Projekt bearbeiten</button>
          </div>
        </article>
      `;
    }).join("")}
  `;
}

function renderList() {
  const list = $("#protocolList");
  if (!state.projects.length) {
    list.innerHTML = `<div class="panel"><p class="muted">Noch keine lokalen Projekte vorhanden.</p></div>`;
    return;
  }
  const projects = [...state.projects].sort((a, b) => (b.id === state.currentProjectId) - (a.id === state.currentProjectId));
  list.innerHTML = projects.map((project) => {
    const stats = projectStats(project);
    const acceptances = stats.acceptances;
    return `
      <article class="project-card" data-project="${project.id}">
        <div class="section-head">
          <div>
            <h3>${escapeHtml(project.name || "Unbenanntes Projekt")}</h3>
            <div class="muted">${escapeHtml(formatAddress(project.address || project.siteAddress, { multiline: false }) || "Adresse offen")}</div>
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
  return state.current.pins.filter((pin) => pinPlacements(pin).some((placement) => placement.planId === plan.id));
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
  const plan = selectedPlan();
  const isRenderable = isPlanRenderable(plan);
  const planSelect = $("#planSelect");
  planSelect.innerHTML = state.current.plans.length
    ? state.current.plans.map((item) => `<option value="${item.id}">${escapeHtml(planDisplayName(item))}</option>`).join("")
    : `<option value="">Kein Plan vorhanden</option>`;
  planSelect.value = plan?.id || "";
  $$("#planMetaFields [data-plan-field]").forEach((field) => {
    field.value = plan ? plan[field.dataset.planField] || "" : "";
    field.disabled = !plan;
  });
  const pageCountField = $('[data-plan-field="pageCount"]');
  if (pageCountField) pageCountField.disabled = true;
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
  const plan = selectedPlan();
  $("#planStatus").textContent = plan ? planStatusText(plan) : "Noch kein Plan hochgeladen.";
  $("#planList").innerHTML = state.current.plans.map((item) => `
    <div class="plan-row ${item.id === state.selectedPlanId ? "active" : ""}">
      <button data-select-plan="${item.id}" type="button">
        <strong>${escapeHtml(planDisplayName(item))}</strong>
        <span class="muted">${escapeHtml(item.documentStatus || "verwendet")} · ${escapeHtml(item.fileName)} · ${item.type === "application/pdf" ? `${item.pageCount || "?"} PDF-Seite(n)` : "Bildplan"} · ${allPinsForPlan(item).length} Markierung(en)</span>
      </button>
      <button class="project-delete-link" data-delete-plan="${item.id}" type="button">Plan löschen</button>
    </div>
  `).join("");
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
  const number = plan.planNumber || `Plan ${plan.number}`;
  return `${number}${plan.title ? " " + plan.title : ""}`;
}

async function renderPlan() {
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
    await renderPdfPlan(plan);
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

async function renderPdfPlan(plan) {
  const canvas = $("#pdfCanvas");
  const image = $("#planImage");
  const empty = $("#emptyPlan");
  try {
    if (!window.pdfjsLib) throw new Error("pdf.js nicht geladen");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    const planRecord = await idbGet("plans", plan.id);
    if (!planRecord?.blob) throw new Error("Planinhalt fehlt. Bitte Plan erneut importieren.");
    if (!planRecord.blob.size) throw new Error("Planinhalt ist leer. Bitte Plan erneut importieren.");
    plan.fileSize = planRecord.blob.size || plan.fileSize || 0;
    const doc = await getPdfDocument(plan);
    plan.pageCount = doc.numPages;
    plan.currentPage = Math.min(Math.max(1, plan.currentPage || 1), doc.numPages);
    const page = await doc.getPage(plan.currentPage);
    const viewport = page.getViewport({ scale: 2 });
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    if (!canvas.width || !canvas.height) throw new Error("PDF-Seite wurde ohne sichtbare Canvas-Größe gerendert.");
    applyPlanElementSize(canvas, plan, canvas.width);
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.maxWidth = "none";
    canvas.style.visibility = "visible";
    canvas.style.opacity = "1";
    const dataUrl = canvas.toDataURL("image/png");
    state.pdfPageCache.set(`${plan.id}:${plan.currentPage}`, dataUrl);
    await showRenderedPdfImage(image, dataUrl, plan, canvas.width);
    canvas.style.display = "none";
    empty.style.display = "none";
    plan.renderStatus = "loaded";
    plan.renderError = "";
    plan.renderSurface = "image-fallback";
    persist();
  } catch (error) {
    setPlanRenderError(plan, error.message || String(error));
    persist();
  }
}

function showRenderedPdfImage(image, dataUrl, plan, naturalWidth) {
  return new Promise((resolve, reject) => {
    image.onload = () => {
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
  element.style.width = "100%";
  element.style.maxWidth = "none";
  element.style.height = "auto";
  const stage = $("#planStage");
  stage.style.width = "100%";
  stage.style.minWidth = "100%";
  stage.style.minHeight = "0";
  stage.style.transform = "none";
  requestAnimationFrame(() => {
    stage.style.width = `${element.clientWidth || stage.clientWidth || 1}px`;
    stage.style.minWidth = stage.style.width;
  });
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
  return state.current?.plans.find((plan) => plan.id === planId) || null;
}

function pinLabel(pin) {
  return `P${pin.number || state.current.pins.findIndex((p) => p.id === pin.id) + 1}`;
}

function checkHasDocumentation(check) {
  return !!(
    check.note ||
    check.pinId ||
    check.photos?.length ||
    check.samples?.length ||
    (check.status && check.status !== "offen / nicht bewertet" && check.status !== "nicht relevant")
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
  check.active = true;
  if (manual) check.manuallyActivated = true;
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
    ${visibleChecks.map((item) => `
    <article class="check-item ${item.active ? "" : "inactive"}" data-check="${item.id}">
      <div class="check-head">
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="muted">${item.active ? "Im Protokoll berücksichtigt" : "Nicht im Protokoll berücksichtigt"} · Gesamtstatus: <strong>${escapeHtml(item.status)}</strong> · ${item.samples.length} Prüfstelle(n)</p>
        </div>
        ${item.active ? `<button class="primary-btn" type="button" data-add-sample="${item.id}">+ Bereich</button>` : `<button class="secondary-btn" type="button" data-activate-check="${item.id}">aktivieren</button>`}
      </div>
      ${item.active
        ? (item.samples.length ? item.samples.map((sample) => sampleCard(item, sample)).join("") : `<p class="muted">Noch keine Prüfstelle angelegt. Mit „+ Bereich“ eine Stichprobe dokumentieren.</p>`)
        : `<p class="muted">Nicht im Protokoll berücksichtigt.</p>`}
    </article>
  `).join("")}
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

function checkScopeRow(item) {
  return `
    <label class="check-scope-row ${item.active ? "active" : ""}">
      <input type="checkbox" data-check-active="${item.id}" ${item.active ? "checked" : ""}>
      <span>${escapeHtml(item.title)}</span>
      <small>${item.active ? "aktiv" : "nicht im Protokoll berücksichtigt"}</small>
    </label>
  `;
}

function sampleCard(check, sample) {
  return `
    <section class="sample-card" data-sample="${sample.id}">
      <div class="sample-title">
        <h4>${escapeHtml(check.title)} – Prüfstelle ${sample.number}</h4>
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

function samplePhotoGrid(sample) {
  if (!sample.photos?.length) return `<p class="muted">Noch keine Fotos in dieser Prüfstelle.</p>`;
  return `<div class="thumb-row">${sample.photos.map((photo) => `
    <figure class="sample-photo">
      <img class="thumb" data-photo-thumb="${photo.id}" alt="${escapeAttr(photo.name || "Foto")}">
      ${barCountSummary(photo)}
      <button class="small-btn" type="button" data-bar-count-photo="${photo.id}">Stäbe zählen (Beta)</button>
      <button class="danger-btn" type="button" data-delete-sample-photo="${sample.id}" data-photo-id="${photo.id}">Foto löschen</button>
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
  const sample = normalizeSample({
    ...seed,
    id: uid("sample"),
    checkItemId: check.id,
    number: nextSampleNumber(check),
    photos: seed.photos ? seed.photos.map((photo) => ({ ...photo })) : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, check.id, nextSampleNumber(check));
  check.samples.push(sample);
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
  if (check.samples.some((sample) => sample.status === "nicht OK / Mangel")) {
    check.status = "nicht OK / Mangel";
  } else if (check.samples.some((sample) => sample.status === "teilweise / Auflage")) {
    check.status = "teilweise / Auflage";
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
  return status.replace("fertig / ", "").replace("teilweise / ", "").replace("nicht OK / ", "");
}

function thumbs(photos) {
  if (!photos?.length) return "";
  return `<div class="thumb-row">${photos.map((photo) => `<img class="thumb" data-photo-thumb="${photo.id}" alt="${escapeAttr(photo.name || "Foto")}">`).join("")}</div>`;
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
      planNumber: meta.planNumber,
      planDate: meta.planDate,
      planIndex: "",
      documentStatus: "verwendet",
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
      planNumber: plan.planNumber,
      planDate: plan.planDate,
      planIndex: plan.planIndex,
      documentStatus: plan.documentStatus,
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
  const planNumberMatch = compact.match(/\b(?:Plan[-\s]?Nr\.?|Plan\s*Nr\.?|Plannummer)\s*[:\-]?\s*([A-ZÄÖÜ]{1,4}[-\s]?\d{2,4}[A-Z]?|\d{2,6})\b/i)
    || compact.match(/\b([A-ZÄÖÜ]{1,4}[-\s]?\d{2,4}[A-Z]?)\b/i);
  return {
    planNumber: planNumberMatch ? String(planNumberMatch[1]).replace(/\s+/g, "-").toUpperCase() : "",
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

function derivePlanMeta(fileName, defaultPlanDate = "") {
  const base = fileName.replace(/\.[^.]+$/, "");
  const normalized = base.replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
  const planNumberMatch = normalized.match(/\b[A-ZÄÖÜ]{1,4}[-\s]?\d{2,4}[A-Z]?\b/i);
  const planNumber = planNumberMatch ? planNumberMatch[0].replace(/\s+/g, "-").toUpperCase() : "";
  let title = normalized;
  if (planNumber) title = title.replace(planNumberMatch[0], "");
  title = title
    .replace(/[-–—]+/g, " ")
    .replace(/\b(plan|bewehrungsplan|schalplan)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return {
    planNumber,
    title: title || normalized || fileName,
    planDate: defaultPlanDate || ""
  };
}

async function preloadPdf(plan) {
  try {
    if (!window.pdfjsLib) throw new Error("pdf.js nicht geladen");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    const doc = await getPdfDocument(plan);
    plan.pageCount = doc.numPages;
    syncPlanRecord(plan);
    await renderPdfPageToDataUrl(plan, 1);
    plan.renderStatus = "idle";
    plan.renderError = "";
  } catch (error) {
    plan.renderStatus = "error";
    plan.renderError = [
      "Plan konnte nicht angezeigt werden.",
      `Datei: ${plan.fileName || "unbekannt"}`,
      `Dateityp: ${plan.type || "unbekannt"}`,
      `Dateigröße: ${formatBytes(plan.fileSize || 0)}`,
      `Fehler: ${error.message || error}`,
      "PDF konnte nicht gerendert werden. Bitte Planseite als JPG/PNG hochladen."
    ].join("\n");
  }
}

function guessFileType(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

async function addPhotos(files) {
  const target = state.photoTarget;
  if (!target || !files.length) return;
  const photos = [];
  const overviewEntries = [];
  for (const file of files) {
    const photo = { id: uid("photo"), name: file.name, type: file.type || "image/jpeg", createdAt: new Date().toISOString(), barCountAnalysis: null };
    await idbPut("photos", {
      id: photo.id,
      projectId: state.current.projectId,
      acceptanceId: state.current.id,
      protocolId: state.current.id,
      pinId: target.kind === "pin" ? target.id : (target.kind === "sample" ? findSample(target.id)?.pinId || "" : ""),
      checkItemId: target.kind === "check" ? target.id : (target.kind === "sample" ? findCheckBySample(target.id)?.id || "" : ""),
      sampleId: target.kind === "sample" ? target.id : "",
      fileName: file.name,
      fileType: photo.type,
      blob: file,
      note: "",
      barCountAnalysis: null,
      createdAt: photo.createdAt
    });
    photos.push(photo);
    if (target.kind === "overview") {
      overviewEntries.push({
        id: uid("overview"),
        protocolId: state.current.id,
        photoId: photo.id,
        caption: "",
        order: (state.current.overviewPhotos || []).length + overviewEntries.length + 1,
        isCover: !(state.current.overviewPhotos || []).some((item) => item.isCover) && overviewEntries.length === 0,
        createdAt: photo.createdAt,
        updatedAt: photo.createdAt
      });
    }
  }
  if (target.kind === "overview") {
    state.current.overviewPhotos = normalizeOverviewPhotos([...(state.current.overviewPhotos || []), ...overviewEntries], state.current.id);
  }
  if (target.kind === "pin") {
    const pin = state.current.pins.find((item) => item.id === target.id);
    pin.photos.push(...photos);
  }
  if (target.kind === "check") {
    const check = state.current.checkpoints.find((item) => item.id === target.id);
    activateCheck(check);
    check.photos.push(...photos);
  }
  if (target.kind === "sample") {
    const sample = findSample(target.id);
    activateCheck(findCheckBySample(target.id));
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
    const check = findCheckBySample(target.id);
    if (check) updateCheckStatus(check);
  }
  saveFromForm();
  renderPinEditor();
  renderChecklist();
  renderOverviewPhotos();
  renderPhotoDialog();
  renderMarkPinSheet(state.selectedPinId);
}

function triggerPhotoPicker(kind, id, source) {
  state.photoTarget = { kind, id };
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
  state.photoTarget = { kind: "overview", id: state.current.id };
  const input = source === "gallery" ? $("#overviewGalleryInput") : $("#overviewCameraInput");
  if (!input) {
    alert("Foto konnte nicht geöffnet oder gespeichert werden.");
    return;
  }
  input.value = "";
  input.click();
}

function triggerInlinePhotoPicker(kind, id, source) {
  state.photoTarget = { kind, id };
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  if (source === "camera") input.setAttribute("capture", "environment");
  if (source === "gallery") input.multiple = true;
  input.className = "visually-hidden";
  input.addEventListener("change", async () => {
    await addPhotos(Array.from(input.files || []));
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
  const plans = Array.isArray(state.current?.plans) ? state.current.plans : [];
  if (!plans.length) {
    alert("Keine Planunterlagen vorhanden. Bitte im Plan-Reiter zuerst einen Plan hinzufügen.");
    return;
  }
  if (isAndroidFirefox()) {
    alert(androidFirefoxWarningText());
  }
  const pin = sample.pinId ? state.current.pins.find((item) => item.id === sample.pinId) : null;
  const preferredPlanId = pin?.planId || sample.planId || state.selectedPlanId || state.current.activePlanId || plans[0].id;
  const selectedMarkPlan = planById(preferredPlanId) || plans[0];
  if (!selectedMarkPlan) {
    alert("Keine Planunterlagen vorhanden. Bitte im Plan-Reiter zuerst einen Plan hinzufügen.");
    return;
  }
  state.markTarget = { sampleId };
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
  const plans = Array.isArray(state.current?.plans) ? state.current.plans : [];
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
  const pin = state.current?.pins.find((item) => item.id === pinId);
  if (!pin) {
    sheet.classList.add("hidden");
    sheet.innerHTML = "";
    return;
  }
  const sample = pin.sampleId ? findSample(pin.sampleId) : null;
  const check = sample ? findCheckBySample(sample.id) : state.current.checkpoints.find((item) => item.id === pin.checkItemId);
  sheet.classList.remove("hidden");
  sheet.innerHTML = `
    <div class="sheet-head">
      <strong>${escapeHtml(pinLabel(pin))} · ${escapeHtml(pin.title || check?.title || "Planmarkierung")}</strong>
      <button class="small-btn" type="button" data-close-mark-pin-sheet>Schließen</button>
    </div>
    <div class="grid compact-grid">
      <label>Status
        <select data-mark-pin-field="status">
          ${STATUSES.map((status) => `<option value="${escapeAttr(status)}" ${pin.status === status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
        </select>
      </label>
      <label>Titel / Bereich
        <input data-mark-pin-field="title" value="${escapeAttr(pin.title || "")}">
      </label>
    </div>
    <label>Bemerkung
      <textarea data-mark-pin-field="note">${escapeHtml(pin.note || "")}</textarea>
    </label>
    <p class="muted">${escapeHtml(check?.title || "Allgemeine Feststellung")}${sample ? ` · Prüfstelle ${sample.number}${sample.location ? ` · ${escapeHtml(sample.location)}` : ""}` : ""}</p>
    <div class="sheet-photo-actions">
      <button class="secondary-btn" type="button" data-mark-pin-photo="camera">Foto aufnehmen</button>
      <button class="secondary-btn" type="button" data-mark-pin-photo="gallery">Foto aus Galerie auswählen</button>
    </div>
    <div class="pin-sheet-photos">
      ${(pin.photos || []).length ? (pin.photos || []).map((photo) => `<img data-photo-thumb="${photo.id}" alt="${escapeAttr(photo.name || "Foto")}">`).join("") : `<span class="muted">Noch keine Fotos.</span>`}
    </div>
    <div class="sheet-actions">
      <button class="secondary-btn" type="button" data-move-mark-pin="${pin.id}">Pin verschieben</button>
      <button class="secondary-btn" type="button" data-reset-mark-pin="${pin.id}">Pin neu setzen</button>
      <button class="secondary-btn" type="button" data-return-sample-from-mark>Zur Prüfstelle zurück</button>
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
  saveFromForm();
  renderMarkPins();
  renderMarkPinSheet(pin.id);
  renderMarkSelectors();
  renderPlan();
  renderChecklist();
}

function removeMarkPin(pinId) {
  const pin = state.current?.pins.find((item) => item.id === pinId);
  if (!pin) return;
  state.current.pins = state.current.pins.filter((item) => item.id !== pinId);
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
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".mic-btn");
    if (!btn || btn.disabled) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.interimResults = false;
    btn.textContent = "Hört zu...";
    recognition.onresult = (resultEvent) => {
      const text = resultEvent.results[0][0].transcript;
      insertVoiceText(btn, text);
      btn.textContent = "Mikrofon";
    };
    recognition.onerror = () => {
      btn.textContent = "Mikrofon";
      alert("Spracherkennung konnte nicht gestartet werden.");
    };
    recognition.onend = () => btn.textContent = "Mikrofon";
    recognition.start();
  });
}

function insertVoiceText(btn, text) {
  if (btn.dataset.voiceFor) {
    const field = $(`[name="${btn.dataset.voiceFor}"]`);
    field.value = `${field.value}${field.value ? " " : ""}${text}`;
    saveFromForm();
  }
  if (btn.dataset.voicePin) {
    const pin = state.current.pins.find((item) => item.id === btn.dataset.voicePin);
    pin.note = `${pin.note}${pin.note ? " " : ""}${text}`;
    saveFromForm();
    renderPinEditor();
  }
  if (btn.dataset.voiceCheck) {
    const check = state.current.checkpoints.find((item) => item.id === btn.dataset.voiceCheck);
    check.note = `${check.note}${check.note ? " " : ""}${text}`;
    saveFromForm();
    renderChecklist();
  }
  if (btn.dataset.voiceSample) {
    const sample = findSample(btn.dataset.voiceSample);
    if (!sample) return;
    sample.note = `${sample.note}${sample.note ? " " : ""}${text}`;
    sample.updatedAt = new Date().toISOString();
    saveFromForm();
    renderChecklist();
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
      saveFromForm();
      status.textContent = "Wetter übernommen, manuell änderbar.";
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

async function buildReportParts() {
  saveFromForm();
  await ensureReportPlanImages();
  const p = state.current;
  const project = projectById(p.projectId);
  const clientCompany = projectClientRecord(project);
  const contractorCompany = projectContractorRecord(project, p);
  const projectInspector = projectInspectorRecord(project);
  const defaultInspectorPerson = projectDefaultInspectorRecord(project, p);
  p.checkpoints.forEach(updateCheckStatus);
  const issues = sampleIssues(p);
  const overviewPhotosHtml = await overviewPhotoReport(p);
  const planAppendixHtml = planAppendixReport(p);
  const photoReportHtml = await photoReport(p);
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
    .status-badge.ok{background:#e7f6ee;color:#12663e;border-color:#adddc2}.status-badge.partial{background:#fff1d6;color:#8a5400;border-color:#f0c56c}.status-badge.bad{background:#ffe1df;color:#9f2a25;border-color:#efa6a1}.status-badge.neutral{background:#eef1f4;color:#4f5b67;border-color:#cfd6dd}
    .issues-list{margin:8px 0 20px;padding-left:22px}.issues-list li{margin:7px 0;padding-left:4px}
    .check-card{border:1px solid #d8dee6;border-radius:8px;margin:12px 0 16px;break-inside:avoid;page-break-inside:avoid;background:#fff;overflow:hidden}
    .check-head{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#f7f9fb;border-bottom:1px solid #d8dee6;padding:10px 12px}
    .sample-card{margin:10px 12px 12px;border:1px solid #e2e7ed;border-radius:6px;break-inside:avoid;page-break-inside:avoid;overflow:hidden}
    .sample-title{display:flex;justify-content:space-between;gap:12px;background:#fbfcfd;border-bottom:1px solid #e2e7ed;padding:8px 10px;font-weight:700}
    .sample-grid{display:grid;grid-template-columns:120px 1fr;gap:0}.sample-grid div{padding:7px 10px;border-bottom:1px solid #edf0f3}.sample-grid div:nth-child(odd){background:#fafbfc;color:#52606d;font-weight:700}
    .calc-note{font-size:11px;background:#f7f9fb;border-top:1px solid #e2e7ed;padding:8px 10px;white-space:pre-wrap}
    .plan{position:relative;width:100%;max-width:100%;display:block;border:1px solid #cfd6dd;background:#fff;padding:4px;break-inside:avoid;page-break-inside:avoid;overflow:visible}.plan img,.report-plan-image{width:100%;max-width:100%;height:auto;object-fit:contain;display:block}
    .pin{position:absolute;transform:translate(-50%,-100%);background:#c93c37;color:#fff;border:2px solid #fff;border-radius:999px 999px 999px 2px;padding:5px 7px;font-weight:bold;box-shadow:0 1px 4px rgba(0,0,0,.3)}
    .appendix-block{break-inside:avoid;page-break-inside:avoid;margin-bottom:18px}.pin-table{font-size:11px}
    .photo-group{break-inside:avoid;page-break-inside:avoid;margin:12px 0 18px;border:1px solid #d8dee6;border-radius:8px;overflow:hidden}.photo-group h3{background:#f7f9fb;border-bottom:1px solid #d8dee6;padding:9px 11px;margin:0}
    .photo-meta{padding:8px 11px;border-bottom:1px solid #edf0f3}.photo-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:11px}.photo img{width:100%;height:180px;object-fit:cover;border:1px solid #cfd6dd;background:#fff}.photo p{font-size:10.5px;color:#697586;margin:5px 0 0}.photo-analysis{padding:6px 8px;border-left:3px solid #f4c542;background:#f7f9fb;color:#1f2933}
    .overview-report-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:8px 0 18px}.overview-report-photo{break-inside:avoid;page-break-inside:avoid;border:1px solid #d8dee6;border-radius:8px;overflow:hidden;background:#fff}.overview-report-photo img{width:100%;height:165px;object-fit:cover;display:block;background:#f7f9fb}.overview-report-photo figcaption{padding:8px 10px;font-size:11px;color:#52606d}.overview-report-photo strong{display:block;color:#17212b;margin-bottom:3px}
    .signature-report{break-inside:avoid;page-break-inside:avoid;margin:14px 0 22px;border:1px solid #d8dee6;border-radius:8px;padding:12px}.signature-image{display:block;width:100%;max-width:620px;height:170px;object-fit:contain;border:1px solid #cfd6dd;border-bottom:3px solid #25313d;background:#fff}.signature-empty{height:120px;border:1px dashed #9aa5b1;display:grid;place-items:center;color:#6b7280}
    .footer-note{margin-top:28px;border-top:1px solid #d8dee6;padding-top:8px;color:#697586;font-size:10.5px;display:flex;justify-content:space-between;gap:12px}
    .page-break,.page-break-before{break-before:page;page-break-before:always}.avoid-break{break-inside:avoid;page-break-inside:avoid}
    @media print{.print-btn,.save-hint{display:none}.report-export,.report-page{width:180mm;max-width:180mm;margin:0;padding:0}.footer-note{position:fixed;bottom:-12mm;left:0;right:0}.page-number:after{content:counter(page)}}
  `;
  const body = `
      <div class="report-export">
      <main class="report-page">
        <header class="report-header">
          <div>
            <div class="brand">Kai BewehrungsCheck · LTH Bau</div>
            <h1>Bewehrungskontrolle / Bewehrungsabnahme</h1>
            <p class="subtitle">Örtliche, stichprobenartige Kontrolle der Bewehrung auf Grundlage der vorliegenden Ausführungs- und Bewehrungspläne. Die Betonagefreigabe erfolgt unter Berücksichtigung der dokumentierten Feststellungen und Auflagen.</p>
          </div>
          <aside class="doc-meta">
            <div><span>Datum</span><strong>${escapeHtml(formatDate(p.head.createdAt))}</strong></div>
            <div><span>Protokoll</span><strong>${escapeHtml(p.id.slice(-8).toUpperCase())}</strong></div>
            <div><span>Seite</span><strong class="page-number"></strong></div>
          </aside>
        </header>

        <section class="info-grid">
          <div class="info-card">
            <h3>Projektinformationen</h3>
            ${infoRow("Projekt / Bauvorhaben", p.head.projectName)}
            ${infoRow("Abnahme", p.head.acceptanceTitle)}
            ${infoRow("Art der Abnahme", p.head.acceptanceType)}
            ${infoRow("Abnahme-ID / Protokoll-ID", p.id)}
            ${infoRow("Baustellenadresse", formatAddress(project?.address || p.head.siteAddress))}
            ${infoRow("Auftraggeber", companyReportText(clientCompany, project?.client || ""))}
            ${infoRow("Prüfingenieur", inspectorReportText(projectInspector, project?.inspector || ""))}
            ${infoRow("Bauteil / Geschoss", `${p.head.component || ""} ${p.head.floor || ""}`.trim())}
            ${infoRow("Bereich / Achsen", p.head.areaAxes)}
          </div>
          <div class="info-card">
            <h3>Prüfung</h3>
            ${infoRow("Datum / Uhrzeit", formatDate(p.head.createdAt))}
            ${infoRow("Prüfer / Abnehmender", ownPersonReportText(defaultInspectorPerson, p.result.inspectorName))}
            ${infoRow("Ausführende Firma", companyReportText(contractorCompany, p.head.contractor))}
            ${infoRow("Allgemeiner Planstand / Prüfstand", p.head.planDate)}
          </div>
        </section>

        <h2>Wetterdaten</h2>
        ${weatherReport(p)}

        <h2>Übersichtsfotos Baustelle</h2>
        ${overviewPhotosHtml}

        <h2>Ergebnis</h2>
        <section class="result-box ${resultClass(p.result.resultStatus)}">
          ${statusBadge(p.result.resultStatus)}
          <p>${resultClause(p.result.resultStatus) || "Ergebnis gemäß Auswahl dokumentiert."}</p>
          ${p.result.finalNote ? `<p><strong>Schlussbemerkung:</strong> ${escapeHtml(p.result.finalNote)}</p>` : ""}
        </section>

        <h2>Verwendete Planunterlagen</h2>
        ${planOverviewReport(p)}

        <h2>Auflagen / Mängel</h2>
        ${issuesReport(issues)}

        <h2>Checkliste und Prüfstellen</h2>
        ${checklistReport(p)}

        ${planAppendixHtml}

        <h2 class="page-break">Fotodokumentation</h2>
        ${photoReportHtml}

        <h2>Schlussformulierung</h2>
        <section class="info-card avoid-break">
          ${infoRow("Prüfer / Abnehmender", ownPersonReportText(defaultInspectorPerson, p.result.inspectorName))}
          ${infoRow("Unterschrift als Text", p.result.signatureText)}
        </section>

        <h2>Unterschriften / Kenntnisnahme</h2>
        ${signatureReport(p)}

        <footer class="footer-note">
          <span>${escapeHtml(p.head.projectName || "Kai BewehrungsCheck")}</span>
          <span>${escapeHtml(formatDate(p.head.createdAt))}</span>
          <span>Kai BewehrungsCheck · Seite <span class="page-number"></span></span>
        </footer>
      </main>
      </div>
  `;
  return { css, body, title: `Bewehrungsabnahme ${p.head.projectName || ""} ${p.head.acceptanceTitle || ""}`, fileName: reportFileName(p) };
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

async function openReportWindow({ print = false, saveHint = false } = {}) {
  return openReportDialog({ printHint: print || saveHint });
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
  printFrame.srcdoc = reportDocumentHtml(parts, { printButton: false, saveHint: false });
  state.reportView.parts = parts;
  updateReportPreviewModeButtons();
  $(".report-browser-hint").textContent = printHint
    ? "Zum Speichern bitte auf „Druckdialog öffnen“ tippen und im Druckdialog als Ziel „Als PDF speichern“ wählen."
    : "Lesemodus ist für das Handy optimiert. Die A4-Ansicht dient zur Kontrolle des Ausdrucks.";
  $("#reportDialog").showModal();
  requestAnimationFrame(updateReportPreviewFrame);
}

async function saveReportHtml() {
  const parts = state.reportView.parts || await buildReportParts();
  const html = reportDocumentHtml(parts, { printButton: false, saveHint: true });
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = sanitizeFileName((parts.fileName || "bewehrungsbericht.pdf").replace(/\.pdf$/i, ".html"));
  link.click();
  URL.revokeObjectURL(url);
}

async function shareReportText() {
  const text = buildReportShareText();
  const title = reportShareTitle();
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      return;
    }
    await copyTextToClipboard(text);
    alert("Berichtstext wurde kopiert. Bitte in WhatsApp einfügen.");
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error(error);
    try {
      await copyTextToClipboard(text);
      alert("Berichtstext wurde kopiert. Bitte in WhatsApp einfügen.");
    } catch (copyError) {
      console.error(copyError);
      alert("Bericht konnte nicht geteilt werden. Bitte Text manuell kopieren.");
    }
  }
}

async function copyWhatsappReportText() {
  try {
    await copyTextToClipboard(buildReportShareText({ compact: true }));
    alert("WhatsApp-Text wurde kopiert. Bitte in WhatsApp einfügen.");
  } catch (error) {
    console.error(error);
    alert("WhatsApp-Text konnte nicht kopiert werden.");
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
  const date = formatDate(p.head.createdAt || p.createdAt || new Date().toISOString());
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

async function saveReportPdfDirectExperimental() {
  const parts = await buildReportParts();
  if (!window.html2pdf) {
    if (confirm("PDF-Erzeugung ist nicht verfügbar. Berichtsvorschau öffnen?")) openReportDialog({ printHint: true });
    return;
  }
  const { host, reportElement } = createPdfExportHost(parts);
  document.body.appendChild(host);
  try {
    validateReportElement(reportElement);
    await waitForReportReady(reportElement);
    const metrics = reportExportMetrics(reportElement);
    console.log("Kai BewehrungsCheck PDF export metrics", metrics);
    if (metrics.scrollWidth > metrics.offsetWidth + 4) {
      console.warn("PDF-Inhalt ist breiter als A4 und wird möglicherweise abgeschnitten.", metrics);
      alert("PDF-Inhalt ist breiter als A4 und wird möglicherweise abgeschnitten.");
    }
    await window.html2pdf()
      .set({
        margin: [8, 8, 10, 8],
        filename: parts.fileName,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          windowWidth: Math.ceil(reportElement.scrollWidth || reportElement.offsetWidth || 718),
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: {
          mode: ["css", "legacy"],
          before: ".page-break",
          avoid: [".avoid-break", ".report-card", ".signature-block", ".check-card", ".sample-card", ".photo-group", ".signature-report", ".appendix-block"]
        }
      })
      .from(reportElement)
      .save();
    if (/iPad|iPhone|iPod|Android/i.test(navigator.userAgent)) {
      alert("PDF wurde erzeugt. Bitte über Teilen/Speichern im Browser sichern, falls der Download nicht automatisch angezeigt wird.");
    }
  } catch (error) {
    console.error(error);
    const message = error?.message || "PDF konnte nicht automatisch gespeichert werden.";
    if (confirm(`${message}\n\nBerichtsvorschau öffnen?`)) openReportDialog({ printHint: true });
  } finally {
    host.remove();
  }
}

function saveReportPdf() {
  return openReportDialog({ printHint: true });
}

function hasAddressContent(address) {
  const item = normalizeAddress(address);
  return !!(item.street || item.zip || item.city || (item.country && item.country !== "Deutschland"));
}

function masterDataWarnings(masterData) {
  const warnings = [];
  masterData.companies.forEach((company, index) => {
    const hasContent = !!(company.role || company.contact || company.phone || company.email || company.note || hasAddressContent(company.address));
    if (!company.name && hasContent) warnings.push(`Firma ${index + 1}: Firmenname fehlt.`);
  });
  [
    ...masterData.companies.map((item) => ["Firma", item.name, item.address]),
    ...masterData.inspectors.map((item) => ["Prüfer", item.name || item.office, item.address]),
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
  return protocol.checkpoints.flatMap((check) =>
    (check.samples || [])
      .filter((sample) => sample.status === "teilweise / Auflage" || sample.status === "nicht OK / Mangel" || sample.overlapCheck?.resultStatus === "teilweise / Auflage" || sample.overlapCheck?.resultStatus === "nicht OK / Mangel")
      .map((sample) => ({ check, sample }))
  );
}

function issuesReport(issues) {
  if (!issues.length) return `<p>Keine Auflagen / Mängel dokumentiert.</p>`;
  return `<ol class="issues-list">
    ${issues.map((issue) => {
      const status = issue.sample.overlapCheck?.resultStatus || issue.sample.status;
      const note = issue.sample.note || issue.sample.overlapCheck?.generatedText || "";
      return `<li><strong>${escapeHtml(issue.check.title)} · Prüfstelle ${issue.sample.number}</strong><br>${statusBadge(status)} ${escapeHtml(issue.sample.location || "")}${issue.sample.pinId ? " · " + escapeHtml(pinName(issue.sample.pinId)) : ""}${note ? `<br>${escapeHtml(note)}` : ""}</li>`;
    }).join("")}
  </ol>`;
}

function checklistReport(protocol) {
  const checks = protocol.checkpoints.filter(shouldIncludeCheckInReport);
  if (!checks.length) {
    return `<p>Keine Checkbereiche aktiviert oder dokumentiert.</p><p class="small">Nicht aufgeführte Prüfpunkte waren im Rahmen dieser Abnahme nicht aktiviert bzw. nicht dokumentiert.</p>`;
  }
  return `${checks.map((check) => `
    <section class="check-card">
      <div class="check-head">
        <h3>${escapeHtml(check.title)}</h3>
        ${statusBadge(check.status || "offen / nicht bewertet")}
      </div>
      ${check.samples?.length ? check.samples.map(sampleReport).join("") : `<p class="muted" style="padding:10px 12px">Dieser Prüfumfang wurde aktiviert, jedoch ohne Einzelprüfstelle dokumentiert.</p>`}
    </section>
  `).join("")}<p class="small">Nicht aufgeführte Prüfpunkte waren im Rahmen dieser Abnahme nicht aktiviert bzw. nicht dokumentiert.</p>`;
}

function sampleReport(sample) {
  return `
    <article class="sample-card">
      <div class="sample-title">
        <span>Prüfstelle ${sample.number}${sample.location ? " · " + escapeHtml(sample.location) : ""}</span>
        ${statusBadge(sample.status)}
      </div>
      <div class="sample-grid">
        <div>Bereich</div><div>${escapeHtml(sample.location || "ohne Angabe")}</div>
        <div>Bemerkung</div><div>${escapeHtml(sample.note || "keine")}</div>
        <div>Pin</div><div>${escapeHtml(pinName(sample.pinId) || "kein Pin")}</div>
        <div>Fotos</div><div>${sample.photos?.length ? `${sample.photos.length} Foto(s)` : "keine"}</div>
      </div>
      ${overlapPdfRows(sample)}
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
  for (const plan of state.current.plans) {
    const pages = [...new Set(state.current.pins.flatMap((pin) => pinPlacements(pin).filter((placement) => placement.planId === plan.id).map((placement) => placement.pageNumber)))];
    if (!pages.length) pages.push(plan.currentPage || 1);
    if (plan.type === "application/pdf") {
      for (const pageNumber of pages) {
        try {
          state.reportPlanImages.set(`${plan.id}:${pageNumber}`, await renderPdfPageToDataUrl(plan, pageNumber));
        } catch {
          plan.renderError = "PDF konnte nicht gerendert werden. Bitte Planseite als JPG/PNG hochladen.";
        }
      }
    } else {
      try {
        const record = await idbGet("plans", plan.id);
        if (record?.blob) {
          const dataUrl = await blobToDataUrl(record.blob);
          pages.forEach((pageNumber) => state.reportPlanImages.set(`${plan.id}:${pageNumber}`, dataUrl));
        }
      } catch {
        plan.renderError = "Planbild konnte nicht geladen werden.";
      }
    }
  }
  persist();
}

function planOverviewReport(p) {
  if (!p.plans.length) return "<p>Es wurden keine Planunterlagen hochgeladen.</p>";
  return `<table>
    <thead><tr><th>Plan-Nr.</th><th>Planbezeichnung</th><th>Status</th><th>Planstand</th><th>Index</th><th>Seite(n)</th><th>Datei</th></tr></thead>
    <tbody>
      ${p.plans.map((plan) => `<tr>
        <td><strong>${escapeHtml(plan.planNumber || "ohne Plan-Nr.")}</strong></td>
        <td>${escapeHtml(plan.title || plan.fileName)}${plan.remark ? `<br><span class="small">${escapeHtml(plan.remark)}</span>` : ""}</td>
        <td>${escapeHtml(plan.documentStatus || "verwendet")}</td>
        <td>${escapeHtml(plan.planDate || "ohne Angabe")}</td>
        <td>${escapeHtml(plan.planIndex || "ohne Angabe")}</td>
        <td>${escapeHtml(plan.pageCount || 1)}</td>
        <td><span class="small">${escapeHtml(plan.fileName)}</span></td>
      </tr>`).join("")}
    </tbody>
  </table>`;
}

function planAppendixReport(p) {
  if (!p.plans.length) return `<h2 class="page-break">Plananhang</h2><p>Keine Pläne hinterlegt.</p>`;
  return p.plans.map((plan, planIndex) => {
    const pages = [...new Set(p.pins.flatMap((pin) => pinPlacements(pin).filter((placement) => placement.planId === plan.id).map((placement) => placement.pageNumber)))];
    if (!pages.length) pages.push(plan.currentPage || 1);
    return pages.map((pageNumber) => {
      const pins = p.pins.filter((pin) => pinHasPlacement(pin, plan.id, pageNumber));
      const image = state.reportPlanImages.get(`${plan.id}:${pageNumber}`);
      return `
        <section class="appendix-block page-break">
          <h2>Anlage ${planIndex + 1} – Plan ${escapeHtml(plan.planNumber || plan.fileName)} – ${escapeHtml(plan.title || "Plananlage")} – Seite ${pageNumber}</h2>
          ${image ? `<div class="plan"><img class="report-plan-image" src="${image}" alt="Plan">${pins.map((pin) => {
            const placement = pinPlacements(pin).find((item) => item.planId === plan.id && item.pageNumber === pageNumber);
            return `<span class="pin" style="left:${(placement?.x ?? pin.x) * 100}%;top:${(placement?.y ?? pin.y) * 100}%">${pinLabel(pin)}</span>`;
          }).join("")}</div>` : `<p>${escapeHtml(plan.renderError || "Planbild nicht verfügbar.")}</p>`}
          <table class="pin-table"><thead><tr><th>Pin</th><th>Zuordnung</th><th>Titel / Bereich</th><th>Status</th><th>Bemerkung</th></tr></thead><tbody>
          ${pins.map((pin) => `<tr><td><strong>${pinLabel(pin)}</strong></td><td>${escapeHtml(pinContextLabel(pin))}</td><td>${escapeHtml(pin.title || "")}</td><td>${statusBadge(pin.status)}</td><td>${escapeHtml(pin.note || "")}</td></tr>`).join("") || `<tr><td colspan="5">Keine Pins auf dieser Seite.</td></tr>`}
          </tbody></table>
        </section>
      `;
    }).join("");
  }).join("");
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
      src: await getPhotoObjectUrl(item.photoId)
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
  const groups = [];
  p.plans.forEach((plan) => {
    p.pins
      .filter((pin) => pinPlacements(pin).some((placement) => placement.planId === plan.id))
      .sort((a, b) => (a.number || 0) - (b.number || 0))
      .forEach((pin) => pin.photos.forEach((photo, index) => {
        const placement = pinPlacements(pin).find((item) => item.planId === plan.id);
        let group = groups.find((item) => item.key === `pin:${pin.id}`);
        if (!group) {
          group = { key: `pin:${pin.id}`, title: `${pinLabel(pin)} – ${pin.title || "Pin"}`, status: pin.status, note: pin.note, meta: `Plan ${plan.planNumber || plan.fileName} / Seite ${placement?.pageNumber || pin.pageNumber || 1}`, photos: [] };
          groups.push(group);
        }
        group.photos.push({ label: `Foto ${index + 1}`, photo });
      }));
  });
  p.checkpoints.forEach((check) => {
    check.samples?.forEach((sample) => {
      sample.photos?.forEach((photo, index) => {
        let group = groups.find((item) => item.key === `sample:${sample.id}`);
        if (!group) {
          group = { key: `sample:${sample.id}`, title: `${check.title} – Prüfstelle ${sample.number}${sample.location ? " – " + sample.location : ""}`, status: sample.status, note: sample.note, meta: sample.pinId ? pinName(sample.pinId) : "", photos: [] };
          groups.push(group);
        }
        group.photos.push({ label: `Foto ${index + 1}`, photo });
      });
    });
  });
  p.checkpoints.forEach((check) => check.photos.forEach((photo, index) => {
    let group = groups.find((item) => item.key === `check:${check.id}`);
    if (!group) {
      group = { key: `check:${check.id}`, title: check.title, status: check.status, note: check.note, meta: check.pinId ? pinName(check.pinId) : "", photos: [] };
      groups.push(group);
    }
    group.photos.push({ label: `Foto ${index + 1}`, photo });
  }));
  if (!groups.length) return "<p>Keine Fotos hinterlegt.</p>";
  for (const group of groups) {
    for (const item of group.photos) item.src = await getPhotoObjectUrl(item.photo.id);
  }
  return groups.map((group) => `
    <section class="photo-group">
      <h3>${escapeHtml(group.title)}</h3>
      <div class="photo-meta">${statusBadge(group.status || "offen / nicht bewertet")} ${group.meta ? escapeHtml(group.meta) : ""}${group.note ? `<br>${escapeHtml(group.note)}` : ""}</div>
      <div class="photo-grid">${group.photos.map((item) => `<div class="photo"><img src="${item.src}" alt="${escapeAttr(item.photo.name || "Foto")}"><p>${escapeHtml(item.label)} · ${escapeHtml(item.photo.name || "")}</p>${barCountReportHtml(item.photo)}</div>`).join("")}</div>
    </section>
  `).join("");
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
      ${analysis.note ? `<br>${escapeHtml(analysis.note)}` : ""}
    </p>
  `;
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
            <tr><td>Zuordnung</td><td>${escapeHtml(signature.category || "")}</td></tr>
            <tr><td>Datum / Uhrzeit</td><td>${escapeHtml(formatDate(signature.signedAt))}</td></tr>
            ${signature.note ? `<tr><td>Bemerkung</td><td>${escapeHtml(signature.note)}</td></tr>` : ""}
          </tbody>
        </table>
        ${signature.signatureData ? `<img class="signature-image" src="${signature.signatureData}" alt="Unterschrift ${escapeAttr(signature.name || "")}">` : `<div class="signature-empty">Keine Unterschriftsgrafik erfasst.</div>`}
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
  const firstLine = [inspector.name, inspector.office].filter(Boolean).join(" / ");
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
  if (status.includes("teilweise") || status.includes("Auflage") || status.includes("Nachkontrolle")) return "partial";
  if (status.includes("OK") || status.includes("freigegeben")) return "ok";
  return "neutral";
}

function resultClass(status = "") {
  if (status === "Nicht zur Betonage freigegeben") return "bad";
  if (status === "Zur Betonage freigegeben unter Auflagen" || status === "Nachkontrolle erforderlich") return "partial";
  if (status === "Zur Betonage freigegeben") return "ok";
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
  return "";
}

function pinName(id) {
  const pin = state.current.pins.find((item) => item.id === id);
  if (!pin) return "";
  const placement = pinPlacements(pin).find((item) => item.isPrimary) || pinPlacements(pin)[0];
  const plan = planById(placement?.planId || pin.planId);
  return `${pinLabel(pin)} · ${plan?.planNumber || plan?.fileName || "Plan"} / S.${placement?.pageNumber || pin.pageNumber || 1}`;
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
    appVersion: "v67",
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
    appVersion: "v67",
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

function bindEvents() {
  $("#newProjectBtn").addEventListener("click", createProject);
  $("#newFromListBtn").addEventListener("click", createProject);
  $("#backBtn").addEventListener("click", async () => {
    if ($("#editorView")?.classList.contains("active")) {
      saveFromForm();
      renderList();
      await navigateToView("listView");
      return;
    }
    await navigateToView("homeView");
  });
  $("#saveBtn").addEventListener("click", async () => {
    if ($("#masterDataView")?.classList.contains("active")) {
      const saved = await saveMasterData();
      if (saved) await navigateToView("homeView");
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
    $$(".tab").forEach((tab) => tab.classList.toggle("active", tab === btn));
    $$(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === btn.dataset.tab));
    if (btn.dataset.tab === "checkTab") renderChecklist();
    if (btn.dataset.tab === "planTab") renderPlan();
    if (btn.dataset.tab === "resultTab") {
      renderOverviewPhotos();
      renderSignatures();
    }
  }));
  $("#protocolForm").addEventListener("input", (event) => {
    if (event.target.matches("[data-plan-field]")) {
      const plan = selectedPlan();
      if (plan) {
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
    if (event.target.matches("[data-sample-field]")) {
      const sample = findSample(event.target.closest("[data-sample]").dataset.sample);
      if (!sample) return;
      const check = findCheckBySample(sample.id);
      activateCheck(check);
      sample[event.target.dataset.sampleField] = event.target.value;
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
  $("#protocolForm").addEventListener("change", (event) => {
    if (event.target.matches("[data-plan-field]")) {
      renderPlanListStatus();
      persist();
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
  $("#masterDataPanel").addEventListener("input", handleMasterDataInput);
  $("#masterDataPanel").addEventListener("change", handleMasterDataInput);
  $("#markPinSheet").addEventListener("input", (event) => {
    if (!event.target.matches("[data-mark-pin-field]")) return;
    const pin = state.current?.pins.find((item) => item.id === state.selectedPinId);
    if (!pin) return;
    pin[event.target.dataset.markPinField] = event.target.value;
    pin.updatedAt = new Date().toISOString();
    const sample = pin.sampleId ? findSample(pin.sampleId) : null;
    if (sample && event.target.dataset.markPinField === "note") {
      sample.note = event.target.value;
      sample.updatedAt = pin.updatedAt;
    }
    schedulePersist();
    renderMarkPins();
  });
  $("#markPinSheet").addEventListener("change", (event) => {
    if (!event.target.matches("[data-mark-pin-field]")) return;
    const pin = state.current?.pins.find((item) => item.id === state.selectedPinId);
    if (!pin) return;
    pin[event.target.dataset.markPinField] = event.target.value;
    pin.updatedAt = new Date().toISOString();
    const sample = pin.sampleId ? findSample(pin.sampleId) : null;
    if (sample && event.target.dataset.markPinField === "status") {
      sample.status = event.target.value;
      sample.updatedAt = pin.updatedAt;
      const check = findCheckBySample(sample.id);
      if (check) updateCheckStatus(check);
    }
    persist();
    renderChecklist();
  });
  document.addEventListener("click", (event) => {
    const dynamicNav = event.target.closest("[data-nav]");
    if (dynamicNav) navigateToView(dynamicNav.dataset.nav);
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
      navigateToView("listView");
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
      closePlanMarkDialog();
      renderChecklist();
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
    const statusCheck = event.target.closest("[data-check-status]");
    if (statusCheck) {
      const item = state.current.checkpoints.find((check) => check.id === statusCheck.closest("[data-check]").dataset.check);
      activateCheck(item);
      item.status = statusCheck.dataset.checkStatus;
      persist();
      renderChecklist();
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
    if (saveSig) saveSignature(saveSig.dataset.saveSignature);
    const deleteSig = event.target.closest("[data-delete-signature]");
    if (deleteSig && confirm("Diese Unterschrift wirklich löschen?")) deleteSignature(deleteSig.dataset.deleteSignature);
    const pdfSave = event.target.closest("#pdfSaveBtn");
    if (pdfSave) saveReportPdf();
    const pdfPrint = event.target.closest("#pdfPrintBtn");
    if (pdfPrint) openReportDialog({ printHint: true });
    const pdfPreview = event.target.closest("#pdfPreviewBtn");
    if (pdfPreview) openReportDialog({ printHint: false });
    const deletePlanButton = event.target.closest("[data-delete-plan]");
    if (deletePlanButton && confirm("Plan wirklich löschen? Zugeordnete Pins auf diesem Plan werden ebenfalls entfernt.")) deletePlanById(deletePlanButton.dataset.deletePlan);
  });
  $("#addPlanBtn").addEventListener("click", () => $("#planInput").click());
  $("#importPlansBtn").addEventListener("click", openPlanImportDialog);
  $("#addSignatureBtn").addEventListener("click", addSignature);
  $("#createProjectConfirmBtn").addEventListener("click", createProjectFromDialog);
  $("#projectClientToMasterBtn").addEventListener("click", () => addProjectFieldToMaster("client"));
  $("#projectContractorToMasterBtn").addEventListener("click", () => addProjectFieldToMaster("contractor"));
  $("#projectInspectorToMasterBtn").addEventListener("click", () => addProjectFieldToMaster("inspector"));
  $("#projectDefaultInspectorToMasterBtn").addEventListener("click", () => addProjectFieldToMaster("defaultInspector"));
  $("#createAcceptanceConfirmBtn").addEventListener("click", createProtocolFromDialog);
  $("#acceptanceTypeToMasterBtn").addEventListener("click", () => saveLookupFromAcceptanceDialog("acceptanceTypes", "#acceptanceTypeInput", "eine Abnahmeart"));
  $("#acceptanceComponentToMasterBtn").addEventListener("click", () => saveLookupFromAcceptanceDialog("components", "#acceptanceComponentInput", "ein Bauteil"));
  $("#acceptanceFloorToMasterBtn").addEventListener("click", () => saveLookupFromAcceptanceDialog("floors", "#acceptanceFloorInput", "ein Geschoss"));
  $("#acceptanceAreaToMasterBtn").addEventListener("click", () => saveLookupFromAcceptanceDialog("areaAxes", "#acceptanceAreaInput", "einen Bereich oder eine Achse"));
  $("#cancelAcceptanceBtn").addEventListener("click", closeAcceptanceDialog);
  $("#acceptanceDialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeAcceptanceDialog();
  });
  $("#acceptanceDialog").addEventListener("cancel", () => {
    state.pendingAcceptanceProjectId = "";
  });
  $("#acceptanceDialog").addEventListener("close", () => {
    const returnFocus = state.acceptanceDialogReturnFocus;
    state.acceptanceDialogReturnFocus = null;
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
  });
  $("#cancelDuplicateBtn").addEventListener("click", () => $("#duplicateDialog").close());
  $("#createDuplicateBtn").addEventListener("click", () => duplicateProtocol($("#duplicateSourceInput").value));
  $("#duplicateTypeInput").addEventListener("change", (event) => {
    $("#duplicateHint").textContent = event.target.value === "Nachkontrolle"
      ? "Für Nachkontrollen können Planunterlagen oder offene Auflagen bewusst per Checkbox übernommen werden. Automatisch wird nichts Planbezogenes übernommen."
      : "Planunterlagen, Pins, Fotos, Ergebnis und Unterschriften werden standardmäßig nicht übernommen.";
  });
  $("#cancelPlanImportBtn").addEventListener("click", () => $("#planImportDialog").close());
  $("#confirmPlanImportBtn").addEventListener("click", importSelectedPlans);
  $("#planImportSourceInput").addEventListener("change", renderPlanImportOptions);
  $("#saveMasterDataBtn").addEventListener("click", () => saveMasterData());
  $("#saveLeaveMasterDataBtn").addEventListener("click", () => {
    $("#unsavedMasterDataDialog").close("save");
    state.pendingMasterDataLeaveResolve?.("save");
    state.pendingMasterDataLeaveResolve = null;
  });
  $("#discardMasterDataBtn").addEventListener("click", () => {
    $("#unsavedMasterDataDialog").close("discard");
    state.pendingMasterDataLeaveResolve?.("discard");
    state.pendingMasterDataLeaveResolve = null;
  });
  $("#cancelLeaveMasterDataBtn").addEventListener("click", () => {
    $("#unsavedMasterDataDialog").close("cancel");
    state.pendingMasterDataLeaveResolve?.("cancel");
    state.pendingMasterDataLeaveResolve = null;
  });
  $("#unsavedMasterDataDialog").addEventListener("cancel", (event) => {
    event.preventDefault();
    $("#unsavedMasterDataDialog").close("cancel");
    state.pendingMasterDataLeaveResolve?.("cancel");
    state.pendingMasterDataLeaveResolve = null;
  });
  $("#unsavedMasterDataDialog").addEventListener("close", (event) => {
    if (state.pendingMasterDataLeaveResolve) {
      state.pendingMasterDataLeaveResolve(event.target.returnValue || "cancel");
      state.pendingMasterDataLeaveResolve = null;
    }
  });
  $("#pinModeBtn").addEventListener("click", () => {
    if (!selectedPlan()) return alert("Bitte zuerst einen Plan hinzufügen.");
    if (!isPlanRenderable(selectedPlan())) return alert("Bitte zuerst einen Plan laden.");
    state.pinMode = !state.pinMode;
    if (state.pinMode) state.placementModePinId = "";
    renderPlanControls();
  });
  $("#zoomOutBtn").addEventListener("click", () => changeZoom(-0.25));
  $("#zoomInBtn").addEventListener("click", () => changeZoom(0.25));
  $("#zoomResetBtn").addEventListener("click", () => setPlanZoom(1));
  $("#zoomFitBtn").addEventListener("click", fitPlanToView);
  $("#planTopBtn").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $("#markBackBtn").addEventListener("click", closePlanMarkDialog);
  $("#markPinBtn").addEventListener("click", () => {
    state.mark.movePinId = "";
    state.mark.active = true;
    hideMarkPinSheet();
    renderMarkSelectors();
    renderMarkPins();
  });
  $("#markZoomOutBtn").addEventListener("click", () => setMarkZoom((state.mark.zoom || 1) / 1.25));
  $("#markZoomInBtn").addEventListener("click", () => setMarkZoom((state.mark.zoom || 1) * 1.25));
  $("#markZoomResetBtn").addEventListener("click", () => setMarkZoom(1));
  $("#markFitBtn").addEventListener("click", fitMarkPlan);
  $("#markPlanSelect").addEventListener("change", (event) => {
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
  $("#markPageSelect").addEventListener("change", (event) => {
    state.mark.pageNumber = Number(event.target.value) || 1;
    state.mark.panX = 0;
    state.mark.panY = 0;
    state.mark.movePinId = "";
    state.mark.active = false;
    renderMarkSelectors();
    renderMarkPlan();
  });
  $("#planMarkDialog").addEventListener("cancel", (event) => {
    event.preventDefault();
    closePlanMarkDialog();
  });
  $("#closeReportBtn").addEventListener("click", () => $("#reportDialog").close());
  $("#reportReadModeBtn").addEventListener("click", () => setReportPreviewMode("read"));
  $("#reportA4ModeBtn").addEventListener("click", () => setReportPreviewMode("a4"));
  $("#shareReportBtn").addEventListener("click", shareReportText);
  $("#copyWhatsappTextBtn").addEventListener("click", copyWhatsappReportText);
  $("#saveReportHtmlBtn").addEventListener("click", saveReportHtml);
  $("#printReportBtn").addEventListener("click", () => {
    const frame = $("#reportPrintFrame");
    const printTarget = frame?.contentWindow;
    if (printTarget?.print) {
      printTarget.focus();
      printTarget.print();
    } else if (typeof window.print === "function") {
      window.print();
    } else {
      alert("Bitte über Browser-Menü Drucken / Als PDF speichern verwenden.");
    }
  });
  $("#planSelect").addEventListener("change", (event) => switchPlan(event.target.value));
  $("#pageSelect").addEventListener("change", (event) => {
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
  $("#planInput").addEventListener("change", (event) => {
    handlePlanFiles(Array.from(event.target.files));
    event.target.value = "";
  });
  $("#photoCameraBtn").addEventListener("click", () => {
    const input = $("#photoCameraInput");
    input.value = "";
    input.click();
  });
  $("#photoGalleryBtn").addEventListener("click", () => {
    const input = $("#photoGalleryInput");
    input.value = "";
    input.click();
  });
  $("#photoCameraInput").addEventListener("change", async (event) => {
    await addPhotos(Array.from(event.target.files));
    event.target.value = "";
  });
  $("#photoGalleryInput").addEventListener("change", async (event) => {
    await addPhotos(Array.from(event.target.files));
    event.target.value = "";
  });
  $("#overviewCameraInput").addEventListener("change", async (event) => {
    try {
      state.photoTarget = { kind: "overview", id: state.current?.id || "" };
      await addPhotos(Array.from(event.target.files || []));
    } catch (error) {
      console.error(error);
      alert("Foto konnte nicht geöffnet oder gespeichert werden.");
    } finally {
      event.target.value = "";
    }
  });
  $("#overviewGalleryInput").addEventListener("change", async (event) => {
    try {
      state.photoTarget = { kind: "overview", id: state.current?.id || "" };
      await addPhotos(Array.from(event.target.files || []));
    } catch (error) {
      console.error(error);
      alert("Foto konnte nicht geöffnet oder gespeichert werden.");
    } finally {
      event.target.value = "";
    }
  });
  $("#cancelBarCountBtn").addEventListener("click", () => $("#barCountDialog").close());
  $("#saveBarCountBtn").addEventListener("click", saveBarCountAnalysis);
  $("#weatherBtn").addEventListener("click", fetchWeather);
  $("#exportJsonBtn").addEventListener("click", exportJson);
  $("#exportFullBackupBtn").addEventListener("click", exportFullBackup);
  $("#importFullBackupBtn").addEventListener("click", () => $("#fullBackupInput").click());
  $("#fullBackupInput").addEventListener("change", (event) => importFullBackup(event.target.files?.[0]));
  $("#exportProjectPackageBtn").addEventListener("click", exportProjectPackage);
  $("#importProjectPackageBtn").addEventListener("click", () => $("#projectPackageInput").click());
  $("#projectPackageInput").addEventListener("change", (event) => importProjectPackage(event.target.files?.[0]));
  $("#defaultInspector").addEventListener("input", (event) => { state.settings.defaultInspector = event.target.value; persist(); });
  $("#defaultCompany").addEventListener("input", (event) => { state.settings.defaultCompany = event.target.value; persist(); });
  $("#storageCheckBtn").addEventListener("click", checkStorage);
  $("#clearAllBtn").addEventListener("click", () => {
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
  state.selectedPlanId = state.current.plans[0]?.id || "";
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
    planNumber: plan.planNumber,
    planDate: plan.planDate,
    planIndex: plan.planIndex || "",
    documentStatus: plan.documentStatus || "verwendet",
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

async function checkStorage() {
  try {
    const projectCount = await idbCount("projects");
    const protocolCount = await idbCount("protocols");
    const masterCount = await idbCount("masterData");
    const planCount = await idbCount("plans");
    const photoCount = await idbCount("photos");
    const masterData = normalizeMasterData(await idbGet("masterData", "app"));
    $("#storageCheckResult").textContent = [
      "IndexedDB verfügbar: ja",
      `${projectCount} Projekt(e)`,
      `${protocolCount} Abnahme(n)`,
      `${planCount} Plan-Datei(en)`,
      `${photoCount} Foto(s)`,
      `${masterCount} Stammdaten-Satz`,
      `${masterData.companies.length} Firma/Firmen`,
      `${masterData.inspectors.length} Prüfingenieur(e)`,
      `${masterData.ownPersons.length} eigene Person(en)`,
      `letzte Stammdaten-Speicherung: ${masterData.lastSavedAt ? formatDate(masterData.lastSavedAt) : "noch nicht manuell gespeichert"}`
    ].join(" · ");
  } catch (error) {
    $("#storageCheckResult").textContent = `IndexedDB verfügbar: nein oder fehlerhaft (${error?.message || error}).`;
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
  const baseWidth = Math.min(naturalWidth, 1200);
  plan.panX = 0;
  plan.panY = 0;
  setPlanZoom(Math.max(0.5, Math.min(5, (wrap.clientWidth - 12) / baseWidth)));
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
    }
    wrap.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });
  wrap.addEventListener("pointermove", (event) => {
    if (!state.touch.active || !state.touch.pointers.has(event.pointerId)) return;
    state.touch.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = Array.from(state.touch.pointers.values());
    if (points.length >= 2) {
      const distance = pointerDistance(points[0], points[1]);
      const center = pointerCenter(points[0], points[1]);
      if (Math.abs(distance - state.touch.startDistance) > 8) state.touch.moved = true;
      setPlanZoom(state.touch.startZoom * (distance / Math.max(1, state.touch.startDistance)), center.x, center.y);
    } else {
      const dx = event.clientX - state.touch.startX;
      const dy = event.clientY - state.touch.startY;
      if (Math.hypot(dx, dy) > 8) state.touch.moved = true;
      if (!state.touch.pinTapCandidate || state.touch.moved) {
        const plan = selectedPlan();
        if (!plan) return;
        plan.panX = state.touch.startPanX + dx;
        plan.panY = state.touch.startPanY + dy;
        clampPlanPan(plan);
        applyPlanTransform(plan);
      }
    }
    event.preventDefault();
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
  wrap.addEventListener("wheel", (event) => {
    if (!selectedPlan()) return;
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
    else if (!cancelled && !wasPinching && state.mark.active && !state.mark.moved && !state.mark.pointers.size) placeSamplePin(point.x, point.y);
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
  await load();
  bindEvents();
  bindMarkGestures();
  bindVoice();
  updateDeviceStorageInfo();
  renderBrowserWarnings();
  renderHomeProjects();
  renderList();
  window.addEventListener("resize", updateReportPreviewFrame);
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(() => cacheRuntimeAssets()).catch(() => {});
  }
}

boot().catch((error) => showStorageWarning(`IndexedDB konnte nicht gestartet werden: ${error.message || error}`));







