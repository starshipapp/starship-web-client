import { faCommentAlt, faFileAlt, faFolderOpen, faGlobe, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Divider from "../../components/display/Divider";
import MenuItem from "../../components/menu/MenuItem";
import Markdown from "../../util/Markdown";

function LandingUseCases(): JSX.Element {
  const [tab, setTab] = useState("community");
  return (
    <div className="flex w-3/4 mx-auto pb-12">
      <div className="mr-10 rounded-lg overflow-hidden w-xl h-72 flex-shrink-0 bg-gray-800 shadow-lg pointer-events-none flex my-auto">
        <div className="bg-gray-700 h-full w-44 pt-2 pb-2 relative flex flex-col flex-shrink-0">
          <MenuItem
            icon={faGlobe}
          >
            {tab === "community" && "LFG Central"}
            {tab === "projects" && "Starship"}
            {tab === "school" && "Calculus I"}
          </MenuItem>
          <Divider/>
          <MenuItem
            icon={faHome}
          >Home</MenuItem>
          {tab === "community" && <>
            <MenuItem
              icon={faFileAlt}
            >Rules</MenuItem>
            <MenuItem
              icon={faCommentAlt}
            >Chat</MenuItem>
          </>}
          {tab === "projects" && <>
            <MenuItem
              icon={faFolderOpen}
            >Files</MenuItem>
            <MenuItem
              icon={faFileAlt}
            >Changelog</MenuItem>
          </>}
          {tab === "school" && <>
            <MenuItem
              icon={faFileAlt}
            >Syllabus</MenuItem>
            <MenuItem
              icon={faFileAlt}
            >Notes</MenuItem>
            <MenuItem
              icon={faCommentAlt}
            >Discussion</MenuItem>
          </>}
          <div className="mt-auto"/>
          <Divider/>
          <MenuItem
            icon={faUser}
          >Lemon</MenuItem>
        </div>
        <div className="w-full h-full flex flex-col px-8 py-6">
          {tab === "community" && <Markdown>
            {`
# Welcome to LFG Central!

Here you can find all the information you need to get started with LFG Central.
- [Rules](#)
- [Moderators](#)
- [Chat](#)

## Rules
1. No spamming. This includes posting links to other sites, or posting the same message multiple times. This also includes reactions.
            `}
          </Markdown>}
          {tab === "projects" && <Markdown>
            {`
# Todo
- [x] Add a project page 
- [ ] Add a project changelog 
- [ ] Upload files 

## Finish landing page
- [ ] Demos for each component
- [x] Header
- [x] Introduction
- [ ] Pricing
            `}
          </Markdown>}
          {tab === "school" && <Markdown>
            {`
# Important information
Limits are written like this:
$\\lim_{x \to -\\infty} f(x)$

You can use LaTeX in your posts like this:

\`\`\`
$\\lim_{x \to -\\infty} f(x)$
\`\`\`
            `}
          </Markdown>}
        </div>
      </div>

      <div className="flex flex-col my-auto w-full">
        <div className="font-extrabold text-4xl">
          <span className="mr-1.5">The place for your</span>
          <span
            className={`${tab === "community" ? "text-white" : "text-gray-500"} cursor-pointer mx-1.5`}
            onClick={() => setTab("community")}
          >community</span>
          <span
            className={`${tab === "projects" ? "text-white" : "text-gray-500"} cursor-pointer mx-1.5`}
            onClick={() => setTab("projects")}
          >projects</span>
          <span
            className={`${tab === "school" ? "text-white" : "text-gray-500"} cursor-pointer mx-1.5`}
            onClick={() => setTab("school")}
          >school</span>
          <span>.</span>
        </div>
        {tab === "community" && <div className="text-lg">
          <div className="mt-2 font-bold">
            Organize your community in ways never before possible.
          </div>
          <div className="mt-4">
            With Starship, you get pages, file hosting, forums, and chat - all in the same place. That means no more barely readable information channels. No more links to your content 3 pages down a sidebar.
            No more long posts taking up pages of chat.
          </div>
        </div>}
        {tab === "projects" && <div className="text-lg">
          <div className="mt-2 font-bold">
            Backup and keep track of your projects.
          </div>
          <div className="mt-4">
            Keep tabs on what needs to be done with the Page component's task list feature. Backup files and share them with your team using the Files component. Or, just use the Chat component to discuss your project
            with other people. Starship is designed to be flexible enough to handle all your project needs - we use it to develop Starship itself.
          </div>
        </div>}
        {tab === "school" && <div className="text-lg">
          <div className="mt-2 font-bold">
            Online class simplified.
          </div>
          <div className="mt-4">
            <Markdown>
              Share homework with your students using the Files component. Help students with the Chat component. Post information about your class with the Page component. And now, with Starship's extended Markdown support,
              you can write your own $\LaTeX$* formulas directly into almost any text field.
            </Markdown>
            <div className="text-sm">
              <Markdown>
                *$\LaTeX$ support is powered by [$\KaTeX$](https://katex.org/).
              </Markdown>
            </div>
          </div>
        </div>}
      </div>
      
    </div>
  );
}

export default LandingUseCases;
