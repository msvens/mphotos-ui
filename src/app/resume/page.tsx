'use client';

import { PageSpacing } from '@/components/layout/PageSpacing';
import { Paragraph } from '@/components/Paragraph';
import Link from 'next/link';

interface ExperienceProps {
  years: string;
  company: string;
  title: string;
  children: React.ReactNode;
}

function Experience({ years, company, title, children }: ExperienceProps) {
  return (
    <Paragraph>
      <strong>{years}, {title}, {company}</strong>
      <br />
      {children}
    </Paragraph>
  );
}

interface ProjectProps {
  link: string;
  title: string;
  children: React.ReactNode;
}

function Project({ link, title, children }: ProjectProps) {
  return (
    <Paragraph>
      <Link href={link} className="text-blue-600 dark:text-blue-400 hover:underline">{title}</Link>. {children}
    </Paragraph>
  );
}

interface PatentProps {
  title: string;
  id: string;
  type: string;
  issued: string;
}

function Patent({ title, id, type, issued }: PatentProps) {
  return (
    <Paragraph>
      <strong>{title}</strong>
      <br />
      {id}
      <br />
      Type: {type}
      <br />
      Issued: {issued}
    </Paragraph>
  );
}

export default function Resume() {
  return (
    <>
      <PageSpacing />
      <div className="space-y-8 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-light">Resume</h1>

        <Paragraph>
          Martin Svensson is a positive person that is passionate about people and programming.
          As a leader he seeks to understand the end-to-end process to be able to handle technical,
          operational and business related questions. His primary focus areas are people management,
          data intensive services, research, vision and strategy.
        </Paragraph>

        <Paragraph>
          Martin has worked in smaller research organizations, large technology companies, and modern
          devops startups. He spent 3 years building up a research unit in Silicon Valley. He is also
          active in the open source community and was the original author of the OpenId and OAuth2
          extensions for the restlet framework (http://www.restlet.org). Currently he serves as Director
          of Engineering leading a team of 50
        </Paragraph>

        <h2 className="text-2xl font-light mt-8">Experience</h2>

        <Experience years="2018-" company="Spotify" title="Engineering Director">
          Leads the product and engineering teams that develop our core datasets and key metrics and
          safeguarding these from any unwanted behaviour. Our tribe is roughly 50 people including
          engineers, data scientists, product leads and engineering managers.
        </Experience>

        <Experience years="2014-2018" title="Engineering Manager" company="Spotify">
          Managing a team of engineers that develops and operates Spotify&apos;s data infrastructure.
          Focused on our hiring strategy and growing the organisation to roughly twice its size.
          During my tenure I also worked as a manager in the Analytics team to help bootstrap their
          new organisation. Responsible for the technical overview of our platform
        </Experience>

        <Experience years="2011-2014" title="Data Research Manager" company="Ericsson">
          Lead research and development in next generation big data technologies, including large
          scale data bases, analytics and information visualization.
        </Experience>

        <Experience years="2008-2011" title="Director" company="Ericsson USA">
          Responsible for starting research activities in Silicon Valley. The work included
          formulating the research agenda and starting up a new research group that was focused on
          mobile social media and the interplay between the Internet and Telecom application environments
        </Experience>

        <Experience years="2007-2008" title="Senior Researcher" company="Ericsson">
          Ericsson is a world leading software and telecom vendor. Ericsson has over 100.000 employees
          with a global research and development unit. In my role as a senior research I was responsible
          for leading our data mining and recommender system research project.
        </Experience>

        <Experience years="2002-2007" title="Group Leader" company="Swedish Institute of Computer Science">
          In my role as senior research I lead the social computing group at SICS. The group&apos;s main
          focus was on social and mobile services research as well as recommender systems. I managed
          projects and did practical work including programming, writing papers and field studies. and
        </Experience>

        <Experience years="1997-2002" title="Researcher" company="Swedish Institute of Computer Science">
          Swedish Institute of Computer Science (SICS) is the leading computer science research
          institute in Sweden. It consists of roughly 100 researchers working more or less independently.
          As a researcher I worked on information navigation specifically looking at how it could be
          boosted by recommender system type functionality. This role included developing code, writing
          research papers, defining research topics, giving presentations and managing smaller projects.
        </Experience>

        <Experience years="1995-1996" title="Developer" company="Search and Find AB">
          Search and Find developed a high performance search engine for Intranets. At Search and Find
          I worked a developer with a focus on API development and document filters. Specifically created
          the Java JNI wrapper towards the underlying C++ search engine.
        </Experience>

        <h2 className="text-2xl font-light mt-8">Skills</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-lg mb-4">
              <strong>Technical</strong>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Software Development</li>
                <li>Databases</li>
                <li>Recommender Systems</li>
                <li>Prototyping</li>
                <li>Data Engineering</li>
                <li>Mobile Application Development</li>
                <li>Open Source Development</li>
                <li>Scientific Writing</li>
                <li>Application Servers/Web Services</li>
                <li>Operations/Devops</li>
              </ul>
            </div>
            <div className="text-lg">
              <strong>Leadership</strong>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Leading leaders</li>
                <li>People Management</li>
                <li>Strategic Thinking</li>
                <li>Project Management</li>
                <li>Agile</li>
              </ul>
            </div>
          </div>
          <div>
            <div className="text-lg mb-4">
              <strong>Programming Languages</strong>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Java</li>
                <li>Scala</li>
                <li>C/C++</li>
                <li>GO</li>
                <li>C#</li>
                <li>Java Script/React</li>
                <li>Typescript</li>
                <li>php</li>
                <li>HTML/CSS</li>
              </ul>
            </div>
            <div className="text-lg">
              <strong>Languages</strong>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Swedish (native)</li>
                <li>English (fluent)</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-light mt-8">Education</h2>
        <ul className="list-disc ml-6 space-y-2 text-lg">
          <li>2009 Ericsson Leadership Core Curriculum (LCC) for Line Managers</li>
          <li>2003 Ph.D., Dept. Computer and Systems Sciences, Stockholm University</li>
          <li>2002 Certified Project Manager, ProjektTeknik Gunnar Selin AB</li>
          <li>2000 Ph.Lic., Dept. Computer and Systems Sciences, Stockholm University</li>
          <li>1998 M.Sc., Dept. Computer and Systems Sciences, Stockholm University</li>
        </ul>

        <h2 className="text-2xl font-light mt-8">Projects</h2>

        <Project link="https://github.com/msvens/mellowtech-core" title="Mellowtech Core">
          Mellowtech Core is a developer library that myself and Rickard Cöster started to work on in 2002.
          Mellowtech Core is a set of components that we use for doing disc and byte based manipulation of
          Objects. It is typically useful for any scenario that involves storing and sorting large amounts
          of Objects (in the millions) on disc. Mellowtech allows for consistent and fast disc based object
          retrieval. The library is being actively developed.
        </Project>

        <Project link="http://www.restlet.org" title="Restlet OAuth2 and OpenId Extensions">
          Restlet is one of leading java frameworks for restful web services. It consists of a core part
          and a number of extension. Myself and a Collegue was the initial developers of the OAuth2 and
          OpenId extension for restlet. OAuth2 and OpenId are the dominate web mechanisms for doing
          authentication and authorization. The extensions are being actively developed.
        </Project>

        <Project link="https://github.com/msvens/mellowdb" title="MellowDB">
          MellowDB ia hybird database engine (mixed column based and row based layout) with powerful
          search functionality based on the Lucene search engine. The database is being actively developed.
          <br />
          Peformance benchmarks shows that the MellowDB outperform the{' '}
          <Link href="http://www.h2database.com/html/main.html" className="text-blue-600 dark:text-blue-400 hover:underline">
            H2 Database Engine
          </Link>{' '}
          which is commonly regarded as one of the fastest embedded databases for Java.
        </Project>

        <Project link="https://www.sics.se/projects/affective-diary#description" title="Affective Diary">
          Diary writing is something that many people engage in and is a very important tool to keep track
          of the important things. In this project we were looking at ways of enhancing the diary writing
          process by adding contextual and temporal information into the diary itself. By tapping in to
          things a person is doing on the phone together with bodily sensor data we allowed people to
          reflect on what was happening at certain points in time. The Diary itself was developed using
          C# on a tablet and Windows Mobile. The project was later commercialized into a product called
          Affective Health.
        </Project>

        <Project link="http://soda.swedish-ict.se/81/" title="Mobitip, Mobile Recommender">
          Mobitip was an early example (2005) of a location based mobile app for recommending places -
          such as restaurants and shops. It was developed on - at that time the only true smart phone OS -
          Symbian and used bluetooth to automatically exchange recommendations between people that were
          close to each other. The recommender system itself was a hybrid centralized/decentralized one
          allowing it to function while not being connected.
        </Project>

        <Project link="http://dl.acm.org/citation.cfm?id=1096739" title="Kalas, Recipe Recommender">
          Kalas was a very early recommnender system - similar to Amazon&apos;s: &quot;people who bought this book
          also bought&quot;. The difference being that we created Kalas back in 2000. I developed the back end
          and client parts of Kalas as part of my PhD thesis work. In this project we also did extensive
          user studies to find out how and what triggers people to use recommender systems or more generally
          engage in social navigation. Kalas is the Swedish word for party.
        </Project>

        <h2 className="text-2xl font-light mt-8">Patents</h2>

        <Patent
          title="Inferring environmental knowledge through near field communication and data mining"
          id="US 8266027 B2"
          type="Grant"
          issued="September 11, 2012"
        />

        <Patent
          title="Root cause problem detection in network traffic information"
          id="US 7813298 B2"
          type="Grant"
          issued="October 12, 2010"
        />

        <Patent
          title="Policy controlled preload and consumption of software application"
          id="WO 2013070126 A1"
          type="Application"
          issued="May 16, 2013"
        />

        <Patent
          title="System and method for device addressing"
          id="US 20120278854 A1"
          type="Application"
          issued="November 1, 2012"
        />

        <Patent
          title="Context-Aware Mobile Search Based on User Activities"
          id="US 20120269116 A1"
          type="Application"
          issued="October 25, 2012"
        />

        <Patent
          title="Method and system for conducting a monetary transaction using a mobile communication device"
          id="US 20120226611 A1"
          type="Application"
          issued="September 6, 2012"
        />

        <Patent
          title="Method, apparatus and computer program product for publishing public content and private content associated with the public content"
          id="US 20120204272 A1"
          type="Application"
          issued="August 9, 2012"
        />

        <Patent
          title="Method and arrangement in a communication network"
          id="US 20120096156 A1"
          type="Application"
          issued="April 19, 2012"
        />

        <Patent
          title="Deviating behaviour of a user terminal"
          id="US 20120060219 A1"
          type="Application"
          issued="March 8, 2012"
        />

        <Patent
          title="Method and Apparatus for Service Selection and Indication"
          id="US 20110208824 A1"
          type="Application"
          issued="August 25, 2011"
        />

        <Patent
          title="Lossy compression of data"
          id="WO 2009095083 A1"
          type="Application"
          issued="August 6, 2009"
        />
      </div>
    </>
  );
} 