// doctor-registration.js
class DoctorRegistration {
  constructor() {
    this.doctors = [];
  }

  registerDoctor(doctorInfo) {
    this.doctors.push(doctorInfo);
  }

  getDoctors() {
    return this.doctors;
  }
}

module.exports = DoctorRegistration;
