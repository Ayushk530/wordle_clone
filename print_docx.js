const docx = require('docx');
console.log("PageNumber type:", typeof docx.PageNumber);
console.log("PageNumber keys:", docx.PageNumber ? Object.keys(docx.PageNumber) : "null");
console.log("docx keys containing Page:", Object.keys(docx).filter(k => k.toLowerCase().includes("page")));
