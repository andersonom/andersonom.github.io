type Role = {
  company: string
  period: string
  location: string
  title?: string
  summary?: string
}

const roles: Role[] = [
  { company: 'BDC', period: 'May 2026 – Present', location: 'Montreal, Canada · Hybrid · Full-time contract' },
  { company: 'National Bank of Canada', period: 'Jul 2022 – May 2026', location: 'Montreal, Canada · Hybrid', summary: 'Skills listed: continuous integration and delivery (CI/CD).' },
  { company: 'SII Canada', period: 'Sep 2020 – Jul 2022', location: 'Montreal, Canada · Remote', summary: 'Skills listed: CI/CD and OpenShift.' },
  { company: 'TOTVS', period: 'Apr 2020 – Aug 2020', location: 'São Paulo, Brazil · Remote', summary: 'Helped design and build a .NET payment hub MVP with interchangeable providers. Used Event Storming to model the workflows.' },
  { company: 'Vivo (Telefônica Brasil)', period: 'Apr 2019 – Mar 2020', location: 'São Paulo, Brazil', summary: 'Developed .NET financial microservices to integrate a cloud service broker with Jamcracker.' },
  { company: 'Sage', period: 'Dec 2018 – Mar 2019', location: 'São Paulo, Brazil · Remote', summary: 'Worked across the stack on a financial management MVP, with a focus on the front end.' },
  { company: 'C Teleport', period: 'Sep 2018 – Nov 2018', location: 'Rotterdam, Netherlands · Remote', summary: 'Delivered three microservices and six front-end features as a freelance engineer.' },
  { company: 'Bankly – Banking as a Service', period: 'Mar 2018 – Sep 2018', location: 'São Paulo, Brazil', summary: 'Built financial microservices for transfers and new payment types, plus front-end features for the Acesso Card prepaid product.' },
  { company: 'UnitedHealth Group', period: 'Apr 2017 – Feb 2018', location: 'São Paulo, Brazil', summary: 'Developed mobile and web applications for consolidating medical records and registering healthcare professionals.' },
  { company: 'Unimed', period: 'Oct 2016 – Mar 2017', location: 'São Paulo, Brazil', summary: 'Contributed to five healthcare projects using C#, ASP.NET, Entity Framework and SQL Server.' },
  { company: 'Agência de Vapores GRIEG', period: 'Sep 2014 – Sep 2016', location: 'Santos, Brazil', title: 'Senior System Specialist', summary: 'Launched the company website, expanded its intranet and electronic document workflows, and managed network and data center infrastructure.' },
  { company: 'Itaú Unibanco', period: 'Oct 2013 – Sep 2014', location: 'São Paulo, Brazil', summary: 'Led architecture and development of a claims management system whose first phase served more than 250 employees across three departments.' },
  { company: 'Sanofi', period: 'Nov 2011 – Oct 2013', location: 'São Paulo, Brazil', summary: 'Developed more than 20 business process management solutions and substantially rewrote the main BPM tool.' },
  { company: 'IBM', period: 'Apr 2010 – Nov 2011', location: 'São Paulo, Brazil · Remote', summary: 'Built features and supported Allied Holding’s repair software across the US and Canada. Worked on the front end of Itaú’s call center application.' },
]

export default function Experience() {
  return (
    <section className="experience" lang="en" aria-labelledby="experience-heading">
      <div className="experience-heading">
        <h2 id="experience-heading">Work experience</h2>
        <a href="https://www.linkedin.com/in/andersonom/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
      <ol className="experience-timeline" role="list">
        {roles.map(({ company, period, location, title = 'Software Engineer', summary }) => (
          <li key={company}>
            <p className="experience-period">{period}</p>
            <h3>{company}</h3>
            <p className="experience-title">{title}</p>
            <p className="experience-location">{location}</p>
            {summary && <p className="experience-summary">{summary}</p>}
          </li>
        ))}
      </ol>
    </section>
  )
}
