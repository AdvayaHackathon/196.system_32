// hospital-schedule.js
class HospitalSchedule {
  constructor() {
    this.schedule = {};
  }

  addDoctor(doctorId, availability) {
    this.schedule[doctorId] = availability;
  }

  generateSchedule() {
    const schedule = {};
    for (const doctorId in this.schedule) {
      schedule[doctorId] = [];
      for (let i = 0; i < 10; i++) {
        schedule[doctorId].push({ time: `10:00 ${i}`, available: true });
      }
    }
    return schedule;
  }
}

module.exports = HospitalSchedule;
