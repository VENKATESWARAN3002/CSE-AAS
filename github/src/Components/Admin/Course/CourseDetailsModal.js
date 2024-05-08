import React from 'react';

const CourseDetailsModal = ({ course, onClose }) => {
  // Handle potential scenario where course data is missing
  if (!course) {
    return (
      <div className='modal'>
        <h2>Course Details</h2>
        <p>Course information unavailable.</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }
  const processCourseOutcomes = (courseOutcomeString) => {
    // Split by semicolons to separate CO# and explanations
    const outcomes = courseOutcomeString.split(';');
  
    return outcomes.map((outcome) => {
      // Separate CO# and explanation (assuming colon separates them)
      const [coNumber, explanation] = outcome.split(':');
      return {
        coNumber: coNumber?.trim(), // Extract and trim CO# (optional chaining)
        explanation: explanation?.trim() // Extract and trim explanation
      };
    });
  };

  const courseOutcomes = processCourseOutcomes(course.COs);

  return (
    <div className='modal'> {/* Style the modal appropriately */}
      <h2>Course Details</h2>
      <p><b>Course Code:</b> {course.c_code}</p>
      <p><b>Course Name:</b> {course.c_name}</p>
      <p><b>Course Type:</b> {course.c_type}</p>
      <p><b>Program:</b> {course.program}</p>
      <p><b>Semester:</b> {course.semester}</p>
      <p><b>Total Credits:</b> {course.c_TC}</p>
      <table className='course-outcomes-table' border={1}> {/* Apply styles using CSS class */}
        <tbody>
          <tr ><td rowSpan={6}><b>Course Outcomes</b></td></tr>
          {courseOutcomes.map((outcome) => (
            <tr key={outcome.coNumber}>
              {/* Display CO# and explanation from each outcome object */}
              <td><div key={outcome.coNumber}><b>{outcome.coNumber}</b></div></td>
              <td><div key={outcome.explanation}>{outcome.explanation}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CourseDetailsModal;
