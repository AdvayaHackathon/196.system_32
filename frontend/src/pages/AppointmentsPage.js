import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      time: '09:00 AM',
      type: 'Check-up',
      status: 'Confirmed',
      department: 'Cardiology'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'Pending',
      department: 'Endocrinology'
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      time: '02:00 PM',
      type: 'Consultation',
      status: 'Confirmed',
      department: 'Neurology'
    }
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'appointment',
      action: 'scheduled',
      patientName: 'Sarah Wilson',
      time: '2 hours ago',
      details: 'Annual check-up scheduled for next week'
    },
    {
      id: 2,
      type: 'appointment',
      action: 'cancelled',
      patientName: 'Robert Brown',
      time: '5 hours ago',
      details: 'Emergency appointment cancelled'
    },
    {
      id: 3,
      type: 'appointment',
      action: 'rescheduled',
      patientName: 'Emily Davis',
      time: '1 day ago',
      details: 'Follow-up appointment moved to next month'
    },
    {
      id: 4,
      type: 'appointment',
      action: 'completed',
      patientName: 'Michael Taylor',
      time: '2 days ago',
      details: 'Routine check-up completed successfully'
    }
  ]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    console.log('Selected date:', format(newDate, 'yyyy-MM-dd'));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth();
  const firstDayOfMonth = startOfMonth(selectedDate);
  const startingDay = firstDayOfMonth.getDay();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            New Appointment
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {format(selectedDate, 'MMMM yyyy')}
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDateChange(new Date())}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Today
                </button>
                <button 
                  onClick={() => handleDateChange(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Previous
                </button>
                <button 
                  onClick={() => handleDateChange(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Next
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: startingDay }, (_, i) => (
                <div key={`empty-${i}`} className="h-12" />
              ))}
              
              {days.map(day => {
                const isCurrentDay = isToday(day);
                const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                
                return (
                  <div
                    key={format(day, 'yyyy-MM-dd')}
                    onClick={() => handleDateChange(day)}
                    className={`h-12 flex items-center justify-center cursor-pointer rounded ${
                      isCurrentDay ? 'bg-blue-100' : ''
                    } ${
                      isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                Appointments for {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                      <p className="text-sm text-gray-600">{appointment.patientName}</p>
                      <p className="text-xs text-gray-500">{appointment.department}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{appointment.type}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.action === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                    activity.action === 'cancelled' ? 'bg-red-100 text-red-600' :
                    activity.action === 'rescheduled' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {activity.action === 'scheduled' ? '✓' :
                     activity.action === 'cancelled' ? '×' :
                     activity.action === 'rescheduled' ? '↔' :
                     '✓'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.patientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AppointmentsPage; 