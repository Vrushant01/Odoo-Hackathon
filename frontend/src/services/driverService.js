import api from "./api";

// Helper to convert blob URL to File object for Multer uploads
const convertBlobUrlToFile = async (blobUrl, filename = "avatar.jpg") => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
  } catch (error) {
    console.error("Failed to convert blob URL to File:", error);
    return null;
  }
};

// Helper to map backend driver to frontend driver schema
export const mapDriverToFrontend = (d) => {
  if (!d) return null;
  const licenseMap = {
    "Commercial": "Class A CDL",
    "Transport": "Class B CDL",
    "LMV": "Class C CDL"
  };

  const getAvatar = () => {
    if (!d.profileImage) {
      return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";
    }
    if (d.profileImage.startsWith("http")) return d.profileImage;
    // Map relative uploads path to absolute backend server location
    const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace("/api/v1", "");
    return `${base}${d.profileImage}`;
  };

  return {
    id: d._id,
    avatar: getAvatar(),
    name: d.fullName,
    email: d.email,
    phone: d.phoneNumber,
    emergencyContact: d.emergencyContact?.name || d.emergencyContact || "",
    licenseNumber: d.licenseNumber,
    licenseCategory: licenseMap[d.licenseCategory] || d.licenseCategory || "Class A CDL",
    licenseExpiry: d.licenseExpiryDate ? d.licenseExpiryDate.split("T")[0] : "",
    dob: d.dateOfBirth ? d.dateOfBirth.split("T")[0] : "",
    address: d.address || "",
    city: d.city || "",
    state: d.state || "",
    country: d.country || "USA",
    joiningDate: d.joiningDate ? d.joiningDate.split("T")[0] : "",
    experience: d.experience || 0,
    bloodGroup: d.bloodGroup || "O+",
    status: d.status || "Available",
    assignedVehicle: d.assignedVehicle ? (d.assignedVehicle.registrationNumber || d.assignedVehicle) : null,
    currentTrip: d.currentTrip || null,
    safetyScore: d.safetyScore || 100,
    notes: d.remarks || ""
  };
};

// Helper to map frontend driver data to backend schema
export const mapDriverToBackend = (data) => {
  const licenseMap = {
    "Class A CDL": "Commercial",
    "Class B CDL": "Transport",
    "Class C CDL": "LMV"
  };
  return {
    fullName: data.name,
    email: data.email,
    phoneNumber: data.phone,
    emergencyContact: {
      name: data.emergencyContact,
      relation: "Emergency",
      phone: ""
    },
    licenseNumber: data.licenseNumber,
    licenseCategory: licenseMap[data.licenseCategory] || data.licenseCategory || "Commercial",
    licenseExpiryDate: data.licenseExpiry,
    dateOfBirth: data.dob,
    address: data.address,
    city: data.city,
    state: data.state,
    country: data.country,
    joiningDate: data.joiningDate,
    experience: Number(data.experience || 0),
    bloodGroup: data.bloodGroup,
    status: data.status,
    remarks: data.notes
  };
};

export const driverService = {
  getDrivers: async (params = {}) => {
    const backendParams = {};
    if (params.page !== undefined) backendParams.page = params.page;
    if (params.limit !== undefined) backendParams.limit = params.limit;
    if (params.search) backendParams.search = params.search;

    if (params.sort) {
      const fieldMap = {
        name: "fullName",
        licenseExpiry: "licenseExpiryDate",
        safetyScore: "safetyScore",
        experience: "experience"
      };
      const backendField = fieldMap[params.sort] || params.sort;
      backendParams.sort = params.sortOrder === "desc" ? `-${backendField}` : backendField;
    }

    if (params.status) backendParams.status = params.status;
    if (params.region) backendParams.region = params.region;

    const res = await api.get("/drivers", { params: backendParams });
    if (res.data && res.data.drivers) {
      return {
        drivers: res.data.drivers.map(mapDriverToFrontend),
        pagination: res.data.pagination
      };
    }

    const arrayData = Array.isArray(res.data) ? res.data : (res.data?.drivers || []);
    return arrayData.map(mapDriverToFrontend);
  },

  getDriver: async (id) => {
    const res = await api.get(`/drivers/${id}`);
    const details = res.data;
    const mapped = mapDriverToFrontend(details.driver);
    
    // Map documents to expected structure
    const docs = {
      drivingLicense: details.driver.licenseDocument ? { name: "Driving License CDL", size: "750 KB", expiryDate: mapped.licenseExpiry } : null,
      govId: details.driver.governmentId ? { name: "Government ID", size: "1.2 MB", expiryDate: "N/A" } : null,
      medicalCert: details.driver.medicalCertificate ? { name: "DOT Medical Cert", size: "600 KB", expiryDate: "N/A" } : null,
      policeVerification: details.driver.policeVerification ? { name: "Police Background Clearance", size: "950 KB", expiryDate: "N/A" } : null
    };
    
    return { ...mapped, documents: docs };
  },

  createDriver: async (data) => {
    let payload;
    let headers = {};

    if (data.avatar && data.avatar.startsWith("blob:")) {
      const file = await convertBlobUrlToFile(data.avatar, "avatar.jpg");
      if (file) {
        payload = new FormData();
        const backendData = mapDriverToBackend(data);
        Object.keys(backendData).forEach(key => {
          if (key === "emergencyContact") {
            payload.append("emergencyContact[name]", backendData.emergencyContact.name);
            payload.append("emergencyContact[relation]", backendData.emergencyContact.relation);
            payload.append("emergencyContact[phone]", backendData.emergencyContact.phone);
          } else {
            payload.append(key, backendData[key]);
          }
        });
        payload.append("profileImage", file);
        headers["Content-Type"] = "multipart/form-data";
      }
    }

    if (!payload) {
      payload = mapDriverToBackend(data);
    }

    const res = await api.post("/drivers", payload, { headers });
    return mapDriverToFrontend(res.data);
  },

  updateDriver: async (id, data) => {
    let payload;
    let headers = {};

    if (data instanceof FormData) {
      payload = data;
    } else {
      if (data.avatar && data.avatar.startsWith("blob:")) {
        const file = await convertBlobUrlToFile(data.avatar, "avatar.jpg");
        if (file) {
          payload = new FormData();
          const backendData = mapDriverToBackend(data);
          Object.keys(backendData).forEach(key => {
            if (key === "emergencyContact") {
              payload.append("emergencyContact[name]", backendData.emergencyContact.name);
              payload.append("emergencyContact[relation]", backendData.emergencyContact.relation);
              payload.append("emergencyContact[phone]", backendData.emergencyContact.phone);
            } else {
              payload.append(key, backendData[key]);
            }
          });
          payload.append("profileImage", file);
          headers["Content-Type"] = "multipart/form-data";
        }
      }

      if (!payload) {
        payload = mapDriverToBackend(data);
      }
    }

    const res = await api.put(`/drivers/${id}`, payload, { headers });
    return mapDriverToFrontend(res.data);
  },

  deleteDriver: async (id) => {
    return await api.delete(`/drivers/${id}`);
  },

  activateDriver: async (id) => {
    const res = await api.patch(`/drivers/${id}/activate`);
    return mapDriverToFrontend(res.data);
  },

  suspendDriver: async (id, details) => {
    const res = await api.patch(`/drivers/${id}/suspend`, {
      reason: details.reason,
      suspendedDate: details.suspensionDate,
      remarks: details.notes
    });
    return mapDriverToFrontend(res.data);
  },

  getDriverTrips: async (id) => {
    const res = await api.get(`/drivers/${id}/history`);
    return (res.data.trips || []).map((t) => ({
      id: t._id,
      vehicle: t.vehicle?.registrationNumber || "Vehicle",
      origin: t.source,
      destination: t.destination,
      distance: t.actualDistance || t.plannedDistance,
      status: t.status,
      startDate: t.dispatchDate ? t.dispatchDate.split("T")[0] : "N/A"
    }));
  },

  getDriverPerformance: async (id) => {
    const res = await api.get(`/drivers/${id}/performance`);
    const perf = res.data;
    return {
      safetyScore: perf.safetyScore,
      violations: perf.violations,
      accidents: perf.accidents,
      warnings: 0,
      safeTrips: perf.completedTrips,
      completedTrips: perf.completedTrips,
      cancelledTrips: perf.cancelledTrips,
      averageDistance: `${perf.distanceCovered} mi`,
      fuelEfficiency: `${perf.averageFuelEfficiency} mpg`,
      onTimeRate: 100,
      averageRating: perf.averageRating
    };
  },

  getDriverTimeline: async (id) => {
    const res = await api.get(`/drivers/${id}/timeline`);
    return (res.data || []).map((log) => ({
      id: log._id,
      event: log.eventType,
      description: log.description,
      date: log.createdAt ? log.createdAt.split("T")[0] : "N/A",
      user: log.createdBy?.fullName || "System"
    }));
  }
};

export default driverService;
