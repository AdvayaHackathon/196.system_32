// patient-registration.js
class PatientRegistration {
  constructor() {
    this.patients = [];
  }

  registerPatient(patientInfo) {
    this.patients.push(patientInfo);
  }

  getPatients() {
    return this.patients;
  }
}

module.exports = PatientRegistration;
