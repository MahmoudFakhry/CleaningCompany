import React from 'react';
import PropTypes from 'prop-types';
import './OurTeam.css';

const teamMembers = {
  Red: [
    { id: '1', firstName: 'John', lastName: 'Doe', title: 'Lead Developer', bio: 'John has over 10 years of experience in software development.' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', title: 'UX Designer', bio: 'Jane specializes in creating user-centric designs and experiences.' },
  ],
  Yellow: [
    { id: '3', firstName: 'Bob', lastName: 'Brown', title: 'Product Manager', bio: 'Bob is responsible for product planning and execution.' },
    { id: '4', firstName: 'Carol', lastName: 'Davis', title: 'Marketing Specialist', bio: 'Carol drives our marketing strategies and campaigns.' },
  ],
  White: [
    { id: '5', firstName: 'Charlie', lastName: 'Wilson', title: 'HR Manager', bio: 'Charlie manages recruitment and employee relations.' },
    { id: '6', firstName: 'Diana', lastName: 'Garcia', title: 'Office Manager', bio: 'Diana keeps the office running smoothly and efficiently.' },
  ],
  Black: [
    { id: '7', firstName: 'Fay', lastName: 'Lopez', title: 'Business Analyst', bio: 'Fay analyzes business needs and provides data-driven insights.' },
    { id: '8', firstName: 'George', lastName: 'Anderson', title: 'Customer Support', bio: 'George addresses customer inquiries and support issues.' },
  ],
  Blue: [
    { id: '9', firstName: 'Ivy', lastName: 'Walker', title: 'Graphic Designer', bio: 'Ivy creates visual content that engages and informs.' },
    { id: '10', firstName: 'Jack', lastName: 'White', title: 'Content Writer', bio: 'Jack crafts compelling content and messaging for our brand.' },
  ],
  Administrators: [
    { id: '11', firstName: 'Laura', lastName: 'King', title: 'Chief Executive Officer', bio: 'Laura oversees company operations and strategy.' },
    { id: '12', firstName: 'Mike', lastName: 'Lee', title: 'Chief Technology Officer', bio: 'Mike leads our technology and innovation efforts.' },
  ],
  Placeholder: [
    { id: '13', firstName: 'Placeholder', lastName: 'One', title: 'Position', bio: 'Bio not provided.' },
    { id: '14', firstName: 'Placeholder', lastName: 'Two', title: 'Position', bio: 'Bio not provided.' },
  ],
};

const TeamMember = ({ firstName, lastName, title, bio }) => (
  <div className="team-member">
    <h3 className="member-name">{firstName} {lastName}</h3>
    <p className="member-title">{title}</p>
    <p className="member-bio">{bio}</p>
  </div>
);

TeamMember.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
};

const TeamSection = ({ teamName, members }) => (
  <div className={`team-section ${teamName.toLowerCase()}`}>
    <h2 className="team-name">{teamName}</h2>
    <div className="team-members">
      {members.map(member => (
        <TeamMember
          key={member.id}
          firstName={member.firstName}
          lastName={member.lastName}
          title={member.title}
          bio={member.bio}
        />
      ))}
    </div>
  </div>
);

TeamSection.propTypes = {
  teamName: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const OurTeam = () => (
  <div className="our-team">
    <h1>Our Team</h1>
    {Object.entries(teamMembers).map(([teamName, members]) => (
      <TeamSection
        key={teamName}
        teamName={teamName}
        members={members}
      />
    ))}
  </div>
);

export default OurTeam;
