import type {
  FreelancerDetailDTO,
} from "@/types/FreelancerDTO";

type Props = {
  profile: FreelancerDetailDTO;
};

const FreelancerProfile = ({ profile }: Props) => {
  
  return (
    <div className="flex flex-col items-center w-full mb-8">
      <section className="mx-auto">
        <h2 className="text-2xl font-bold mb-4">Public Profile</h2>
        <p>Username: {profile.username}</p>
        <p>Headline: {profile.headline}</p>
        <p>Experience Level: {profile.experienceLevel}</p>
        <p>Hourly Rate: ${profile.hourlyRate}</p>
        <p>Available for Hire: {profile.availableForHire ? "Yes" : "No"}</p>
        <p>Skills: {profile.skills.map((skill) => skill.name).join(", ")}</p>
        <p>
          Job Subcategories:{" "}
          {profile.jobSubcategories.map((sub) => sub.name).join(", ")}
        </p>
        <p>Languages: {profile.languages.map((lang) => lang.name).join(", ")}</p>
        <p>About: {profile.about}</p>
        <p>Website: {profile.websiteUrl}</p>
        <div>
          Social Media:
          <ul>
            {profile.socialMedia.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );

     
};

export default FreelancerProfile;
