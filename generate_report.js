const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  ExternalHyperlink, TableOfContents
} = require('docx');
const fs = require('fs');
const osPath = require('path');

// Ensure screenshots directory exists
const screenshotsDir = osPath.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

// Image loading helper
function loadImage(path, width, height) {
  const data = fs.readFileSync(path);
  return new ImageRun({
    type: 'png',
    data: data,
    transformation: { width, height },
    altText: { title: 'Screenshot', description: 'Screenshot', name: 'Screenshot' }
  });
}

// Scale image to fit within maxW x maxH preserving aspect ratio
function scaledImage(path, origW, origH, maxW, maxH) {
  const ratio = Math.min(maxW / origW, maxH / origH);
  return loadImage(path, Math.round(origW * ratio), Math.round(origH * ratio));
}

// Borders
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const blackBorder = { style: BorderStyle.SINGLE, size: 6, color: '000000' };
const blackBorders = { top: blackBorder, bottom: blackBorder, left: blackBorder, right: blackBorder };
const thickBlackBorder = { style: BorderStyle.SINGLE, size: 12, color: '000000' };

// Helper: paragraph
function para(text, opts = {}) {
  const { bold = false, italic = false, size = 24, center = false, spaceAfter = 120, spaceBefore = 0, font = 'Times New Roman', color = '000000', underline = false } = opts;
  return new Paragraph({
    alignment: center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    spacing: { before: spaceBefore, after: spaceAfter },
    children: [new TextRun({ text, bold, italic, size, font, color, underline: underline ? {} : undefined })]
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 28, font: 'Times New Roman', color: '000000' })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, font: 'Times New Roman', color: '000000' })]
  });
}

function heading3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, underline: {}, size: 24, font: 'Times New Roman', color: '000000' })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 24, font: 'Times New Roman', color: '000000' })]
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'numbers', level },
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 24, font: 'Times New Roman', color: '000000' })]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function emptyLine(n = 1) {
  return Array(n).fill(null).map(() => new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: '', size: 24 })]
  }));
}

function centeredImg(imagePath, origW, origH, maxW, maxH) {
  // Look in root or screenshots folder
  let resolvedPath = imagePath;
  if (!fs.existsSync(resolvedPath)) {
    resolvedPath = osPath.join(screenshotsDir, imagePath);
  }
  
  if (!fs.existsSync(resolvedPath)) {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: `[SCREENSHOT PLACEHOLDER: Please save "${imagePath}" to screenshots/ directory to embed it]`,
          bold: true,
          color: 'FF0000',
          size: 20,
          font: 'Times New Roman'
        })
      ]
    });
  }
  
  const ratio = Math.min(maxW / origW, maxH / origH);
  const w = Math.round(origW * ratio);
  const h = Math.round(origH * ratio);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
    children: [loadImage(resolvedPath, w, h)]
  });
}

function captionPara(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 40, after: 160 },
    children: [new TextRun({ text, italic: true, size: 22, font: 'Times New Roman', color: '000000' })]
  });
}

function codeBlock(lines) {
  return [
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: 'F4F4F4', type: ShadingType.CLEAR },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
                left: { style: BorderStyle.SINGLE, size: 12, color: '888888' },
                right: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' }
              },
              margins: { top: 120, bottom: 120, left: 180, right: 180 },
              children: lines.map(line => new Paragraph({
                spacing: { before: 20, after: 20 },
                children: [new TextRun({ text: line, size: 18, font: 'Courier New', color: '333333' })]
              }))
            })
          ]
        })
      ]
    }),
    ...emptyLine(1)
  ];
}

// ─── FRONT SHEET (Section 1) ──────────────────────────────────────────────────
const frontSheetChildren = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'B.M.S. COLLEGE OF ENGINEERING', bold: true, size: 32, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: '(Autonomous College under VTU)', bold: true, size: 26, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text: 'Bull Temple Road, Basavanagudi, Bangalore – 560019', bold: true, size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 160 },
    children: [new TextRun({ text: 'A project report on', size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text: 'AUTOMATED CI/CD PIPELINE FOR A PYTHON WORDLE GAME CLONE', bold: true, size: 30, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'Submitted in partial fulfillment of the requirements for the award of degree', size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'BACHELOR OF ENGINEERING', bold: true, size: 26, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'IN', bold: true, size: 26, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: 'COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)', bold: true, size: 26, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'By', size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'Ayush Khanuja (1BM23CD015)', bold: true, size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: 'Yasser Ahmed (1BM23CD062)', bold: true, size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'Under the guidance of', size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'Sandhya G', bold: true, size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'Assistant Professor', size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: 'Department of CSE (Data Science)', bold: true, size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'AY 2025-26', bold: true, size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  pageBreak(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'B.M.S. COLLEGE OF ENGINEERING', bold: true, size: 28, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: '(Autonomous College under VTU)', bold: true, size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text: 'Bull Temple Road, Basavanagudi, Bangalore – 560019', bold: true, size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'Department of Computer Science and Engineering', bold: true, size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text: '(DATA SCIENCE)', bold: true, size: 24, font: 'Times New Roman', color: '000000' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 160 },
    children: [new TextRun({ text: 'CERTIFICATE', bold: true, size: 28, font: 'Times New Roman', color: '000000', underline: {} })]
  }),
  para(
    'This is to certify that the project entitled "AUTOMATED CI/CD PIPELINE FOR A PYTHON WORDLE GAME CLONE" is a bona-fide work carried out by Ayush Khanuja and Yasser Ahmed for the course DevOps with course code 23DS6AEDOP. It is certified that all corrections/suggestions indicated for Internal Assessments have been incorporated in the report deposited in the departmental library. The project report has been approved as it satisfies the academic requirements in respect of project work prescribed for the Bachelor of Engineering Degree.',
    { size: 24, spaceAfter: 320 }
  ),
  // Signature table
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: 4680, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Signature of the Guide', bold: true, size: 24, font: 'Times New Roman' })] }),
              new Paragraph({ children: [new TextRun({ text: 'Sandhya G', size: 24, font: 'Times New Roman' })] }),
              new Paragraph({ children: [new TextRun({ text: 'Assistant Professor', size: 24, font: 'Times New Roman' })] }),
            ]
          }),
          new TableCell({
            borders: noBorders,
            width: { size: 4680, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Signature of the HOD', bold: true, size: 24, font: 'Times New Roman' })] }),
              new Paragraph({ children: [new TextRun({ text: 'Dr. B R Shambhavi', size: 24, font: 'Times New Roman' })] }),
              new Paragraph({ children: [new TextRun({ text: 'Professor & HOD', size: 24, font: 'Times New Roman' })] }),
            ]
          }),
        ]
      })
    ]
  }),
  ...emptyLine(2),
  new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text: 'Examiners', bold: true, size: 24, font: 'Times New Roman' })]
  }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({
        children: [
          new TableCell({ borders: blackBorders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Name of the Examiner', bold: true, size: 24, font: 'Times New Roman' })] })] }),
          new TableCell({ borders: blackBorders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Signature of the Examiner', bold: true, size: 24, font: 'Times New Roman' })] })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ borders: blackBorders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: '1.', size: 24, font: 'Times New Roman' })] })] }),
          new TableCell({ borders: blackBorders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: '', size: 24 })] })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ borders: blackBorders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: '2.', size: 24, font: 'Times New Roman' })] })] }),
          new TableCell({ borders: blackBorders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: '', size: 24 })] })] }),
        ]
      }),
    ]
  }),
];

// ─── ABSTRACT ─────────────────────────────────────────────────────────────────
const abstractChildren = [
  pageBreak(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: 'ABSTRACT', bold: true, size: 28, font: 'Times New Roman', underline: {}, color: '000000' })]
  }),
  para(
    'This project presents the design and implementation of a fully automated Continuous Integration and Continuous Deployment (CI/CD) pipeline for a Python-based Wordle game clone. The application is a Windows-native graphical user interface (GUI) recreation of the popular Wordle word-guessing game, built using the Tkinter library, and features variable word lengths (4 to 7 letters) along with three distinct difficulty levels classified using Google Trends popularity metrics.',
    { spaceAfter: 160 }
  ),
  para(
    'The pipeline, orchestrated using Jenkins, automates the complete software delivery lifecycle from source code management through to deployment and health monitoring. Key automation stages include virtual environment provisioning, static code analysis using flake8, headless unit testing via Python\'s unittest framework, compilation of the GUI application into a standalone Windows executable using PyInstaller, asset deployment to a local production directory, and post-deployment integrity verification and system metrics collection through a custom monitoring script.',
    { spaceAfter: 160 }
  ),
  para(
    'A Docker-free approach was deliberately adopted to address the inherent incompatibility between Tkinter GUI rendering and headless Linux container environments. This design decision allowed the pipeline to run natively on a Windows agent, enabling direct compilation of platform-specific executables. The project demonstrates practical application of DevOps principles including automation, continuous integration, and reliable software delivery while resolving real-world engineering challenges such as headless service limitations, infinite loop import bugs, and resource path resolution in packaged executables.',
    { spaceAfter: 160 }
  ),
  para(
    'Keywords: CI/CD, Jenkins, Python, Tkinter, PyInstaller, DevOps, Wordle, Windows Pipeline, flake8, Unit Testing, Deployment Automation.',
    { italic: true, spaceAfter: 160 }
  ),
];

// ─── TABLE OF CONTENTS ────────────────────────────────────────────────────────
const tocChildren = [
  pageBreak(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: 'TABLE OF CONTENTS', bold: true, size: 28, font: 'Times New Roman', underline: {}, color: '000000' })]
  }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1000, 6960, 1400],
    rows: [
      ...[
        ['1.', 'Introduction', '3'],
        ['1.1', 'Overview of DevOps', '3'],
        ['1.2', 'Objective of the CI/CD Pipeline', '3'],
        ['1.3', 'Scope of the Project', '4'],
        ['1.4', 'Description of the Application', '4'],
        ['1.5', 'Expected Outcomes', '5'],
        ['2.', 'System Requirements', '5'],
        ['2.1', 'Hardware Requirements', '5'],
        ['2.2', 'Software Requirements', '6'],
        ['3.', 'Pipeline Design & Workflow', '7'],
        ['3.1', 'Overall Pipeline Architecture', '7'],
        ['3.2', 'Tools Used and Their Purpose', '8'],
        ['3.3', 'Pipeline Stages', '9'],
        ['4.', 'Continuous Integration (CI) Process', '12'],
        ['4.1', 'CI Implementation', '12'],
        ['4.2', 'Repository Integration & Trigger Mechanism', '12'],
        ['4.3', 'Automated Build & Testing Process', '13'],
        ['5.', 'Continuous Deployment (CD) Process', '15'],
        ['5.1', 'Deployment Workflow', '15'],
        ['5.2', 'Containerisation Note', '16'],
        ['5.3', 'Deployment Steps', '16'],
        ['6.', 'Execution & Output Demonstration', '18'],
        ['7.', 'Challenges Faced & Solutions', '22'],
        ['8.', 'Advantages of the Implemented Pipeline', '23'],
        ['9.', 'Conclusion', '24'],
        ['10.', 'References', '25'],
      ].map(([num, title, page]) =>
        new TableRow({
          children: [
            new TableCell({ borders: noBorders, width: { size: 1000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: num, size: 24, font: 'Times New Roman' })] })] }),
            new TableCell({ borders: noBorders, width: { size: 6960, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: title, size: 24, font: 'Times New Roman' })] })] }),
            new TableCell({ borders: noBorders, width: { size: 1400, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: page, size: 24, font: 'Times New Roman' })] })] }),
          ]
        })
      )
    ]
  }),
];

// ─── SECTION 1: INTRODUCTION ──────────────────────────────────────────────────
const section1 = [
  pageBreak(),
  heading1('1. Introduction'),
  heading2('1.1 Overview of DevOps'),
  para('DevOps is a set of cultural philosophies, practices, and tools that integrates software development (Dev) and IT operations (Ops) to shorten the systems development life cycle and enable the continuous delivery of high-quality software. By breaking down traditional silos between development teams and operations teams, DevOps fosters collaboration, shared responsibility, and iterative improvement throughout the software lifecycle.'),
  para('The DevOps model emphasises automation at every stage of the pipeline: from source code management and automated testing to continuous integration, deployment, and monitoring. Core practices include Continuous Integration (CI), where developers merge code changes frequently and each merge triggers an automated build and test sequence; and Continuous Deployment (CD), where verified builds are automatically released to production or staging environments without manual intervention.'),
  para('At its foundation, DevOps relies on a set of enabling tools and technologies. Version control systems (such as Git) track code changes; CI/CD orchestration tools (such as Jenkins) automate pipeline execution; containerisation platforms (such as Docker) ensure environment consistency; and monitoring frameworks provide real-time feedback on system health. Together, these practices reduce deployment risk, accelerate feature delivery, and improve overall software quality.'),
  heading2('1.2 Objective of the CI/CD Pipeline'),
  para('The primary objective of this project is to design and implement a fully automated CI/CD pipeline that eliminates manual effort in building, testing, packaging, and deploying the Wordle game application. Specific objectives include:'),
  bullet('To automate the provisioning of a Python virtual environment and installation of all project dependencies upon every code commit.'),
  bullet('To enforce code quality standards through automated static analysis using the flake8 linter, preventing syntactically erroneous code from progressing through the pipeline.'),
  bullet('To execute a comprehensive suite of unit tests headlessly within the Jenkins environment, providing rapid regression feedback.'),
  bullet('To package the Python Tkinter GUI application into a single, standalone Windows executable (.exe) using PyInstaller, ensuring end-users require no Python installation.'),
  bullet('To automate the deployment of the compiled executable and all required resource assets to a defined production directory on the Windows host.'),
  bullet('To implement post-deployment health monitoring that validates file integrity and captures system resource metrics, archiving results as build artefacts for auditability.'),
  heading2('1.3 Scope of the Project'),
  para('The scope of this project encompasses the full DevOps lifecycle for a desktop GUI application running on a Windows platform. Specifically, the project covers:'),
  bullet('Source Code Management (SCM) using Git with a GitHub-hosted remote repository.'),
  bullet('Automated polling-based trigger mechanism in Jenkins configured to detect SCM changes every minute.'),
  bullet('Python virtual environment isolation to prevent dependency conflicts between builds.'),
  bullet('Static code analysis using flake8 across the entire project codebase, excluding the virtual environment directory.'),
  bullet('Headless unit testing using Python\'s standard unittest framework targeting core game logic.'),
  bullet('GUI application packaging into a portable Windows executable using PyInstaller with a custom application icon.'),
  bullet('Automated asset deployment to the local production path C:\\WordleAppProduction, including all dictionary word lists, configuration files, and game resources.'),
  bullet('Post-deployment monitoring using a custom Python script that validates file integrity and collects CPU, memory, and disk utilisation metrics via the psutil library.'),
  bullet('Jenkins build artefact archiving for both the compiled executable and the monitoring health report JSON file.'),
  para('The scope explicitly excludes cloud deployment, Kubernetes orchestration, Docker containerisation (due to Tkinter GUI constraints discussed in Section 5.2), and production database management.'),
  heading2('1.4 Description of the Application'),
  para('The application at the centre of this project is a Python-based recreation of the popular Wordle word-guessing game. In the original Wordle, players attempt to guess a five-letter word within six attempts, receiving coloured feedback after each guess indicating whether letters are in the correct position (green), present in the word but in the wrong position (yellow), or absent from the word entirely (grey). This project extends the original concept in the following ways:'),
  bullet('Variable word length: Players may select a word length of 4, 5, 6, or 7 letters, adjusting the difficulty and game window dimensions dynamically by reading layout parameters from a geometry.csv configuration file.'),
  bullet('Three difficulty levels: Words are classified as Easy, Medium, or Hard based on their Google Trends search frequency over the preceding twelve months. Easy words have a mean popularity score above 70 (e.g., apple, water), Medium words fall between 50 and 70, and Hard words score below 50, representing rare or archaic vocabulary.'),
  bullet('Persistent scoring: The application tracks the cumulative number of games won across sessions, storing this count in a plain-text games_won.txt file and displaying it in the game window.'),
  bullet('Standalone executable: When deployed through the CI/CD pipeline, the application is available as a single-file frontend.exe that requires no Python installation on the end-user\'s machine.'),
  para('The application is architecturally divided into two primary modules: frontend.py, which implements the Tkinter GUI including the start window, game board rendering, and colour-coded feedback display; and wordle_automation.py, which contains the game engine logic responsible for loading word files, selecting random words, and computing hint arrays.'),
  heading2('1.5 Expected Outcomes of the Pipeline'),
  para('Upon successful execution of the CI/CD pipeline, the following outcomes are expected:'),
  bullet('A freshly compiled frontend.exe Windows executable, available as a downloadable Jenkins build artefact.'),
  bullet('All game resource files (dictionary_of_words.json, geometry.csv, twelve difficulty-segregated word list text files, and the application icon) deployed to C:\\WordleAppProduction alongside the executable.'),
  bullet('A structured JSON health report (monitoring_report.json) confirming HEALTHY deployment status, with verified file existence, file sizes, and system resource metrics, archived as a Jenkins build artefact.'),
  bullet('A complete audit trail in the Jenkins console output documenting each pipeline stage\'s execution, enabling rapid diagnosis of any future build failures.'),
];

// ─── SECTION 2: SYSTEM REQUIREMENTS ──────────────────────────────────────────
const section2 = [
  pageBreak(),
  heading1('2. System Requirements'),
  heading2('2.1 Hardware Requirements'),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 6240],
    rows: [
      new TableRow({
        children: [
          new TableCell({ borders: blackBorders, shading: { fill: 'F2F2F2', type: ShadingType.CLEAR }, width: { size: 3120, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Component', bold: true, size: 24, font: 'Times New Roman' })] })] }),
          new TableCell({ borders: blackBorders, shading: { fill: 'F2F2F2', type: ShadingType.CLEAR }, width: { size: 6240, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Specification', bold: true, size: 24, font: 'Times New Roman' })] })] }),
        ]
      }),
      ...[ 
        ['Processor', 'Intel Core i3 / AMD Ryzen 3 or higher; Dual-Core 2.0 GHz minimum recommended for Jenkins build concurrency'],
        ['RAM', '4 GB minimum; 8 GB recommended when running Jenkins as a Windows service alongside an active desktop session'],
        ['Storage', '2 GB of available free disk space to accommodate Python virtual environments (approx. 400 MB), Jenkins build workspaces, PyInstaller build artefacts (~100 MB per build), and the production deployment directory'],
        ['Display', 'Any standard monitor; required for the Tkinter GUI application execution and Jenkins web dashboard access'],
        ['Network', 'Internet access required for initial dependency installation via pip and for Git remote repository polling from GitHub'],
      ].map(([comp, spec]) =>
        new TableRow({
          children: [
            new TableCell({ borders: blackBorders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: comp, bold: true, size: 24, font: 'Times New Roman' })] })] }),
            new TableCell({ borders: blackBorders, width: { size: 6240, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: spec, size: 24, font: 'Times New Roman' })] })] }),
          ]
        })
      )
    ]
  }),
  heading2('2.2 Software Requirements'),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 2560, 4000],
    rows: [
      new TableRow({
        children: [
          new TableCell({ borders: blackBorders, shading: { fill: 'F2F2F2', type: ShadingType.CLEAR }, width: { size: 2800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Software', bold: true, size: 24, font: 'Times New Roman' })] })] }),
          new TableCell({ borders: blackBorders, shading: { fill: 'F2F2F2', type: ShadingType.CLEAR }, width: { size: 2560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Version / Detail', bold: true, size: 24, font: 'Times New Roman' })] })] }),
          new TableCell({ borders: blackBorders, shading: { fill: 'F2F2F2', type: ShadingType.CLEAR }, width: { size: 4000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Purpose', bold: true, size: 24, font: 'Times New Roman' })] })] }),
        ]
      }),
      ...[
        ['Operating System', 'Windows 10 / 11 (64-bit)', 'Native host OS for Jenkins Windows agent and Tkinter GUI execution'],
        ['Git', '2.51.0.windows.2', 'Version control, local commits, and GitHub remote synchronisation'],
        ['Jenkins', 'LTS (2.x)', 'CI/CD orchestration; polls SCM and executes declarative pipeline stages'],
        ['Python', '3.12 (64-bit)', 'Runtime for game application, linting, testing, and monitoring scripts'],
        ['pip', 'Latest (bundled)', 'Package installer for Python dependencies from requirements.txt'],
        ['flake8', 'Latest stable', 'Static code analysis and syntax validation tool'],
        ['PyInstaller', 'Latest stable', 'Packages Python scripts and assets into a standalone .exe binary'],
        ['Tkinter', 'Built-in (Python 3.12)', 'GUI framework for the Wordle game graphical interface'],
        ['psutil', 'Latest stable', 'Cross-platform process and system resource monitoring library'],
        ['Docker', 'Not used directly', 'Bypassed due to Tkinter GUI rendering incompatibility in headless Linux containers'],
      ].map(([sw, ver, purpose]) =>
        new TableRow({
          children: [
            new TableCell({ borders: blackBorders, width: { size: 2800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: sw, size: 24, font: 'Times New Roman' })] })] }),
            new TableCell({ borders: blackBorders, width: { size: 2560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: ver, size: 24, font: 'Times New Roman' })] })] }),
            new TableCell({ borders: blackBorders, width: { size: 4000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: purpose, size: 24, font: 'Times New Roman' })] })] }),
          ]
        })
      )
    ]
  }),
];

// ─── SECTION 3: PIPELINE DESIGN & WORKFLOW ────────────────────────────────────
const section3 = [
  pageBreak(),
  heading1('3. Pipeline Design & Workflow'),
  heading2('3.1 Overall Pipeline Architecture'),
  para('The CI/CD pipeline for this project follows a linear declarative model composed of six sequential stages. Each stage must succeed before the subsequent stage is initiated; a failure at any stage halts the pipeline and marks the overall build as failed. The complete architecture is illustrated below.'),
  ...emptyLine(1),
  centeredImg('pipeline_architecture.png', 800, 300, 450, 180),
  captionPara('Figure 3.1 – CI/CD Pipeline Architecture'),
  heading2('3.2 Tools Used and Their Purpose'),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 2400, 4960],
    rows: [
      new TableRow({
        children: [
          new TableCell({ borders: blackBorders, shading: { fill: 'F2F2F2', type: ShadingType.CLEAR }, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Tool', bold: true, size: 24, font: 'Times New Roman' })] })] }),
          new TableCell({ borders: blackBorders, shading: { fill: 'F2F2F2', type: ShadingType.CLEAR }, width: { size: 2400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Category', bold: true, size: 24, font: 'Times New Roman' })] })] }),
          new TableCell({ borders: blackBorders, shading: { fill: 'F2F2F2', type: ShadingType.CLEAR }, width: { size: 4960, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Purpose in this Pipeline', bold: true, size: 24, font: 'Times New Roman' })] })] }),
        ]
      }),
      ...[
        ['Git', 'SCM', 'Tracks all source code changes; enables SCM polling trigger from GitHub remote repository'],
        ['GitHub', 'Remote Repository', 'Hosts the project repository; serves as the source of truth for all pipeline triggers'],
        ['Jenkins', 'CI/CD Orchestrator', 'Manages the declarative pipeline lifecycle; schedules builds, executes stages, archives artefacts'],
        ['Python venv', 'Environment Isolation', 'Creates an isolated Python environment per build to prevent dependency contamination'],
        ['pip', 'Package Manager', 'Installs requirements.txt dependencies and dev tools (flake8, pyinstaller, psutil) into venv'],
        ['flake8', 'Static Analysis', 'Enforces code quality; catches syntax errors and undefined names before compilation'],
        ['unittest', 'Test Framework', 'Executes headless regression tests on core game logic without launching the GUI'],
        ['PyInstaller', 'Packaging', 'Bundles frontend.py and all imports into a self-contained single-file .exe'],
        ['Windows Batch', 'Deployment Script', 'Creates production directory and copies all required assets to C:\\WordleAppProduction'],
        ['monitor.py + psutil', 'Post-Deploy Monitor', 'Validates deployment integrity and records CPU, memory, and disk metrics to JSON'],
      ].map(([tool, cat, purpose]) =>
        new TableRow({
          children: [
            new TableCell({ borders: blackBorders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: tool, size: 24, font: 'Times New Roman' })] })] }),
            new TableCell({ borders: blackBorders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: cat, size: 24, font: 'Times New Roman' })] })] }),
            new TableCell({ borders: blackBorders, width: { size: 4960, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: purpose, size: 24, font: 'Times New Roman' })] })] }),
          ]
        })
      )
    ]
  }),
  heading2('3.3 Pipeline Stages – Detailed Description'),
  heading3('Stage 1: Setup Environment'),
  para('This stage initialises the build environment by creating a Python virtual environment (venv) if one does not already exist, upgrading pip to the latest version, installing all application dependencies from requirements.txt, and installing development tools (flake8, pyinstaller, psutil) required by subsequent stages. Using a venv ensures each build operates in a clean, reproducible environment isolated from any system-wide Python packages.'),
  ...codeBlock([
    'if not exist venv (',
    '    "%BASE_PYTHON%" -m venv venv',
    ')',
    'venv\\Scripts\\python -m pip install --upgrade pip',
    'venv\\Scripts\\pip install -r requirements.txt',
    'venv\\Scripts\\pip install flake8 pyinstaller psutil',
  ]),
  heading3('Stage 2: Lint Code'),
  para('Static code analysis is performed using flake8 across the entire project directory, explicitly excluding the venv subdirectory and any legacy code folders. Error codes for stylistic indentation and formatting (E, W classes) are suppressed to avoid blocking builds on cosmetic issues; however, logical errors such as undefined names and import violations are enforced. This stage acts as a quality gate, ensuring no syntactically broken code proceeds to compilation.'),
  ...codeBlock([
    'venv\\Scripts\\flake8 --exclude=venv,"wordle github"',
    '    --ignore=E,W,F401,F403,F405,F824,F841 .',
  ]),
  heading3('Stage 3: Run Tests'),
  para('Automated regression testing is conducted using Python\'s built-in unittest framework. Jenkins invokes the test runner in discovery mode, which recursively locates all test files matching the pattern test*.py within the tests/ directory. Five test cases are executed, targeting the core hint computation algorithm and word file loading functions. All tests run headlessly without launching the Tkinter GUI, making them fully compatible with the Jenkins Windows service environment.'),
  ...codeBlock([
    'venv\\Scripts\\python -m unittest discover -s tests',
  ]),
  heading3('Stage 4: Build Executable'),
  para('PyInstaller is invoked with the --onefile flag to bundle frontend.py and all its transitive imports into a single, self-contained Windows executable. The --noconsole flag suppresses the console window so the application launches as a pure GUI. A custom application icon (Wordle_2021_Icon.ico) is embedded into the binary. The output is placed in the dist/ subdirectory as dist/frontend.exe.'),
  ...codeBlock([
    'venv\\Scripts\\pyinstaller --clean --noconsole --onefile',
    '    --icon=Wordle_2021_Icon.ico frontend.py',
  ]),
  heading3('Stage 5: Deploy'),
  para('The Deploy stage automates the complete installation process. It creates the production directory C:\\WordleAppProduction if it does not exist, copies the freshly compiled executable from dist/frontend.exe, and transfers all required resource assets: the dictionary JSON file, geometry CSV, application icon, twelve difficulty-segregated word list text files (easy/medium/hard for 4, 5, 6, and 7-letter words), and initialises the games score tracker (games_won.txt) if not already present.'),
  heading3('Stage 6: Monitor'),
  para('A custom Python monitoring script (monitor.py) is executed against the production directory to validate deployment integrity. It checks for the existence and non-zero size of every required file, collects disk usage statistics using Python\'s shutil module, and gathers CPU load percentage and memory utilisation metrics via psutil. The results are serialised to a structured JSON report (monitoring_report.json). If any critical file is missing, the script exits with a non-zero return code, causing Jenkins to mark the build as failed. On success, the report is copied to the build workspace and archived as a Jenkins artefact.'),
  heading2('3.4 Jenkinsfile – Complete Pipeline Code'),
  para('The complete declarative pipeline is defined in the Jenkinsfile at the repository root:'),
  ...codeBlock([
    'pipeline {',
    '    agent any',
    '    environment {',
    '        BASE_PYTHON = \'C:\\\\Users\\\\Ayush Khanuja\\\\...\\\\Python312\\\\python.exe\'',
    '    }',
    '    triggers { pollSCM(\'* * * * *\') }',
    '    stages {',
    '        stage(\'Setup Environment\') { steps { bat \'...\' } }',
    '        stage(\'Lint Code\')         { steps { bat \'...\' } }',
    '        stage(\'Run Tests\')         { steps { bat \'...\' } }',
    '        stage(\'Build Executable\')  { steps { bat \'...\' } }',
    '        stage(\'Deploy\')            { steps { bat \'...\' } }',
    '        stage(\'Monitor\')           { steps { bat \'...\' } }',
    '    }',
    '    post {',
    '        always  { archiveArtifacts artifacts: \'monitoring_report.json\' }',
    '        success { archiveArtifacts artifacts: \'dist/frontend.exe\' }',
    '    }',
    '}',
  ]),
];

// ─── SECTION 4: CI PROCESS ────────────────────────────────────────────────────
const section4 = [
  pageBreak(),
  heading1('4. Continuous Integration (CI) Process'),
  heading2('4.1 Explanation of CI Implementation'),
  para('Continuous Integration in this project is implemented through Jenkins\' declarative pipeline syntax on a Windows agent. Every change committed and pushed to the GitHub repository is automatically detected by Jenkins, which then executes the first three pipeline stages (Setup Environment, Lint Code, Run Tests) in sequence. This ensures that every version of the codebase is built and tested before it is allowed to proceed to the packaging and deployment stages.'),
  para('The CI workflow enforces two quality gates: a static analysis gate (flake8 linting) that catches undefined references and import errors, and a functional correctness gate (unittest suite) that validates calculation logic. Together, these stages guarantee the structural and operational integrity of the Wordle application before compilation.'),
  heading2('4.2 Repository Integration & Trigger Mechanism'),
  para('The project is hosted on a remote GitHub repository. Jenkins is configured to interface with this repository using the Git plugin. To achieve automation without complex webhook routing through local firewalls, a polling-based trigger mechanism is configured:'),
  bullet('Poll SCM (* * * * *): Tells Jenkins to inspect the remote repository every 60 seconds. If new commits are detected, it pulls the changes and triggers the build.'),
  bullet('Manual Trigger: Allows developers to launch builds manually through the Jenkins Web UI via the "Build Now" action.'),
  heading2('4.3 Automated Build & Testing Process'),
  para('The build process runs within a Python virtual environment to prevent package leakage. The linting stage runs:'),
  codeBlock([
    'venv\\Scripts\\flake8 --exclude=venv,"wordle github" --ignore=E,W,F401,F403,F405,F824,F841 .'
  ]),
  para('Followed by the test runner discovering unit tests:'),
  codeBlock([
    'venv\\Scripts\\python -m unittest discover -s tests'
  ]),
  para('If any syntax errors or test assertions fail, Jenkins terminates the build immediately, notifying the development team through the console logs.'),
  heading2('4.4 CI Execution Logs'),
  para('Every code modification pushed to the repository triggers an automated execution run. Below is the Jenkins console output demonstrating the SCM polling detection, source checkout from Git, and workspace synchronization for build run #18:'),
  centeredImg('Screenshot 2026-06-04 221610.png', 800, 400, 480, 220),
  captionPara('Figure 4.1 – Jenkins SCM Trigger and Git Checkout Log'),
];

// ─── SECTION 5: CD PROCESS ────────────────────────────────────────────────────
const section5 = [
  pageBreak(),
  heading1('5. Continuous Deployment (CD) Process'),
  heading2('5.1 Deployment Workflow'),
  para('Continuous Deployment in this project automates the packaging and installation of the game. Once the CI stages succeed, the pipeline transitions to the packaging and deployment stages. This ensures that the production folder always runs the latest compiled and verified release.'),
  heading2('5.2 Containerisation Note'),
  para('A Docker-free approach was chosen for this project because Tkinter is a GUI-dependent toolkit. Tkinter requires a native OS graphical system (Win32 GDI on Windows, X11 on Linux) to draw application windows and receive user inputs. Standard headless Docker containers lack a display window system. Running GUI tests in standard Docker would require complex X11-forwarding configurations or virtual framebuffers (e.g., Xvfb), which add operational overhead and degrade performance.'),
  para('To resolve this, the pipeline compiles a native Windows standalone executable (.exe) using PyInstaller. This packages the Python interpreter, libraries, and GUI code into a single portable binary that runs natively on the Windows host with zero client setup.'),
  heading2('5.3 Deployment Automation Steps'),
  para('The CD automation is executed via a Batch script containing the following steps:'),
  numbered('Checks for the existence of C:\\WordleAppProduction and creates it if missing.'),
  numbered('Copies the compiled binary dist\\frontend.exe to the folder, replacing any older version.'),
  numbered('Copies all auxiliary configuration and assets (geometry.csv, dictionary_of_words.json, difficulty word text files, and Wordle_2021_Icon.ico) into the folder.'),
  numbered('Initialises games_won.txt with a starting score of 0 if the file does not already exist (protecting existing player scores from being overwritten).'),
  heading2('5.4 CD Environment Verification'),
  para('Rather than containerizing the GUI, the PyInstaller deployment script copies the executable and local asset configurations to C:\\WordleAppProduction on the host machine. The health check script then validates that all assets exist and are populated. The detailed monitor output is documented in the Monitoring section of this report.'),
];

// ─── SECTION 6: EXECUTION & OUTPUT ────────────────────────────────────────────
const section6 = [
  pageBreak(),
  heading1('6. Execution & Output Demonstration'),
  heading2('6.1 Application Interface Execution'),
  para('When users run the deployed standalone frontend.exe from C:\\WordleAppProduction, they are presented with the Tkinter game window. The following screens show the startup menu, active gameplay with color-coded hints, and the terminal popup indicating a lost session:'),
  centeredImg('Screenshot 2026-06-04 221653.png', 400, 400, 250, 250),
  captionPara('Figure 6.1 – Wordle Setup Menu (Difficulty & Word Length Selection)'),
  centeredImg('Screenshot 2026-06-04 221823.png', 400, 400, 250, 250),
  captionPara('Figure 6.2 – Active Wordle Gameplay Board (Color-Coded Attempts)'),
  centeredImg('Screenshot 2026-06-04 221835.png', 400, 400, 200, 200),
  captionPara('Figure 6.3 – Game Over Popup Window ("You Lost")'),
  heading2('6.2 Deployed Health Monitoring Output'),
  para('Following the copy phase, the pipeline executes monitor.py to confirm the files are intact and capture the Windows agent health metrics. The output is saved to monitoring_report.json, as displayed below:'),
  centeredImg('Screenshot 2026-06-04 221917.png', 600, 700, 320, 380),
  captionPara('Figure 6.4 – monitoring_report.json: File Integrity Verification'),
  centeredImg('Screenshot 2026-06-04 221931.png', 600, 700, 320, 380),
  captionPara('Figure 6.5 – monitoring_report.json: CPU, Memory, and Disk Metrics'),
];

// ─── SECTION 7: CHALLENGES FACED ──────────────────────────────────────────────
const section7 = [
  pageBreak(),
  heading1('7. Challenges Faced & Solutions'),
  heading2('7.1 Headless GUI Constraints during Pipeline execution'),
  para('Problem: Jenkins runs as a Windows Service under the "Local System" account. Services under this account cannot interact with the desktop or open GUI windows. Attempting to test the Tkinter application by launching it headlessly would hang the pipeline indefinitely waiting for window loop resolution.'),
  para('Solution: The codebase was decoupled. Tests target only the logical backend functions (word picking, hint computation) inside wordle_automation.py, which runs headlessly. The GUI is tested manually by executing the final compiled executable in a normal user session.'),
  heading2('7.2 Infinite Loop blocking unit tests import'),
  para('Problem: The original wordle_automation.py contained an infinite loop (while True: time.sleep(60)) at root level. Importing it in the unit tests or frontend.py blocked the calling thread, causing the test runner to freeze.'),
  para('Solution: The execution loop was wrapped inside a standard __main__ check block, allowing other Python modules to safely import its functions without triggers:'),
  codeBlock([
    "if __name__ == '__main__':",
    "    # execution loop",
    "    while True:",
    "        time.sleep(60)"
  ]),
  heading2('7.3 Resource Resolution in Bundled Executables'),
  para('Problem: Compiled executables operate in temporary directories during runtime, making relative file paths like dictionary_of_words.json fail to resolve.'),
  para('Solution: Rather than embedding raw assets into the binary, the deployment stage copies them into the production folder. PyInstaller is configured to load paths relative to the current directory of execution, resolving missing asset crashes.'),
  heading2('7.4 Jenkins Administrator Lockout'),
  para('Problem: Jenkins security settings occasionally locked out the user due to credential corruption.'),
  para('Solution: A PowerShell script reset_jenkins.ps1 was written to stop the Jenkins service, replace <useSecurity>true</useSecurity> with <useSecurity>false</useSecurity> inside config.xml, and restart the service.'),
];

// ─── SECTION 8: ADVANTAGES ────────────────────────────────────────────────────
const section8 = [
  pageBreak(),
  heading1('8. Advantages of the Implemented Pipeline'),
  bullet('Faster Deployment: PyInstaller compilation and deployment copy takes under 30 seconds, enabling rapid cycles.'),
  bullet('Reduced Manual Effort: Automates setup, testing, linting, packaging, and copy actions with a single git push.'),
  bullet('Environment Isolation: A local Python virtual environment isolates build packages, avoiding package leakage.'),
  bullet('Static Quality Gate: Flake8 halts builds with errors like undefined variables before compiling.'),
  bullet('Post-Deployment Verification: The monitoring stage ensures all files exist and logs resource usage, guaranteeing delivery confidence.'),
];

// ─── SECTION 9: CONCLUSION ────────────────────────────────────────────────────
const section9 = [
  pageBreak(),
  heading1('9. Conclusion'),
  heading2('9.1 Learning Outcomes'),
  para('This project provided practical experience in constructing Windows-native CI/CD pipelines. It highlighted how to interface Jenkins with Windows Shell scripting, package GUI applications using PyInstaller, automate environment configurations, write comprehensive testing suites, and implement file system integrity monitors.'),
  heading2('9.2 Importance of DevOps Practices'),
  para('DevOps practices bridges development and delivery. By automating builds and deployments, developers can focus on features while Jenkins ensures releases are tested, linted, compiled, and deployed consistently. This increases developer productivity and software stability.'),
  heading2('9.3 Future Enhancements'),
  para('Future improvements to this pipeline include:'),
  bullet('Email notification integration on build success/failure states.'),
  bullet('Centralised binary storage (e.g., Nexus, Artifactory) for version tracking.'),
  bullet('SonarQube integration for deeper code coverage and vulnerability analysis.'),
];

// ─── SECTION 10: REFERENCES ──────────────────────────────────────────────────
const section10 = [
  pageBreak(),
  heading1('10. References'),
  bullet('Jenkins Declarative Pipeline: https://www.jenkins.io/doc/book/pipeline/'),
  bullet('PyInstaller packaging: https://pyinstaller.org/en/stable/'),
  bullet('Python unittest module: https://docs.python.org/3/library/unittest.html'),
  bullet('Flake8 Code Linting: https://flake8.pycqa.org/en/latest/'),
  bullet('psutil Resource Monitoring: https://psutil.readthedocs.io/'),
];

// ─── BUILD DOCUMENT ──────────────────────────────────────────────────────────
const children = [
  ...frontSheetChildren,
  ...abstractChildren,
  ...tocChildren,
  ...section1,
  ...section2,
  ...section3,
  ...section4,
  ...section5,
  ...section6,
  ...section7,
  ...section8,
  ...section9,
  ...section10
].flat(Infinity);

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 },
              },
            },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "◦",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 1440, hanging: 360 },
              },
            },
          }
        ]
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 },
              },
            },
          }
        ]
      }
    ]
  },
  sections: [
    {
      properties: {
        titlePage: true,
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 0, after: 120 },
              children: [
                new TextRun({
                  text: "Wordle CI/CD Pipeline DevOps Report",
                  font: "Times New Roman",
                  size: 18,
                  color: "888888"
                })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 120, after: 0 },
              children: [
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: "Times New Roman",
                  size: 20,
                  color: "555555"
                })
              ]
            })
          ]
        })
      },
      children: children
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  const outputPath = osPath.join(__dirname, 'DevOps_Report.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Report successfully created at: ${outputPath}`);
}).catch((err) => {
  console.error("Error creating report:", err);
});
