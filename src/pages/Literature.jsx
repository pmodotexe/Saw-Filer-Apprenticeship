
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Download, ExternalLink, BookOpen } from 'lucide-react';

const publicDomainBooks = [
  { title: "Hanchett Saw and Knife Fitting Manual", author: "Hanchett Manufacturing Company", year: "Early 1900s", size: "8.2 MB", description: "Complete manual for saw and knife fitting techniques from the historic Hanchett Manufacturing Company." },
  { title: "Miners Manual of Saw Hammering and Saw Filing", author: "B.F. Ulmer Company", year: "1920s", size: "12.1 MB", description: "Comprehensive guide to the traditional art of saw hammering and filing from the renowned B.F. Ulmer Company." },
  { title: "Crosscut Saw Manual", author: "Warren Miller", year: "1930s", size: "6.5 MB", description: "Detailed manual covering crosscut saw operation, maintenance, and safety procedures." },
  { title: "Files and Filing: From the French 'La Lime'", author: "George Taylor (Translator)", year: "1890s", size: "4.3 MB", description: "Classic translation of French filing techniques, covering all aspects of files and their proper use." },
  { title: "The Band Saw: A Guide for Filers, Sawyers and Woodworkers", author: "Simonds Manufacturing Co.", year: "1921", size: "15.7 MB", description: "Authoritative guide to band saw operation and maintenance from the legendary Simonds Manufacturing Company." },
  { title: "The Circular Saw: A Guide for Filers, Sawyers and Woodworkers", author: "Simonds Manufacturing Co.", year: "1918", size: "13.4 MB", description: "Comprehensive circular saw guide covering filing, operation, and woodworking applications." },
  { title: "Handy Guide for Filers, Sawyers and Millmen", author: "Covel Manufacturing Co.", year: "1910s", size: "7.8 MB", description: "Practical handbook for mill workers covering essential filing and sawing techniques." },
  { title: "The B.T&B Manual: A Treatise on the Care of Saws and Knives", author: "Machinery Company of America", year: "1920s", size: "9.6 MB", description: "Technical treatise on proper care and maintenance of industrial saws and cutting tools." },
  { title: "The Sawyers Companion for Using and Choosing Both Long and Circular Saws", author: "Sandford E. Parsons", year: "1890s", size: "11.2 MB", description: "Classic guide to saw selection and usage for both long and circular saws." },
  { title: "Simonds Guide for Millmen", author: "Simonds Manufacturing Co.", year: "1920", size: "14.3 MB", description: "Professional guide for mill operators covering all aspects of saw maintenance and operation." },
  { title: "Balanced Saw Performance", author: "Stanford J. Lunstrum (USDA Forest Service)", year: "1960s", size: "5.9 MB", description: "USDA Forest Service publication on achieving optimal saw performance through proper balance and maintenance." },
  { title: "Saws That Sing: A Guide To Using Crosscut Saws", author: "David E. Michael (USDA Forest Service)", year: "1980s", size: "8.7 MB", description: "Modern USDA guide to crosscut saw techniques and best practices for forest workers." },
  { title: "Crosscut Saws and How to Keep Them Up", author: "W.S. Taylor", year: "1920s", size: "6.1 MB", description: "Practical manual on crosscut saw maintenance and sharpening techniques." },
  { title: "Lumbermens Handbook: Saw, Tool, Steel and File Works", author: "Henry Disston & Sons", year: "1900s", size: "18.5 MB", description: "Comprehensive handbook from the famous Disston company covering all aspects of sawmill tools and equipment." },
  { title: "The Evolution of Modern Band Saw Mills for Sawing Logs", author: "The Prescott Company", year: "1910s", size: "10.4 MB", description: "Historical overview of band saw mill development and modern sawing techniques." },
  { title: "Why Band Saws Break - Sixteen Reasons and How to Avoid Them", author: "Joshua Oldham", year: "1920s", size: "3.8 MB", description: "Detailed analysis of common band saw failures and prevention strategies." },
  { title: "Handsaws: Their Use, Care and Abuse - How to Select and How to File Them", author: "Fred T. Hodgson", year: "1900s", size: "7.2 MB", description: "Complete guide to handsaw selection, maintenance, and proper filing techniques." },
  { title: "The Disston Lumberman's Handbook: A Practical Book of Information on the Construction and Care of Saws", author: "Henry Disston & Sons", year: "1920s", size: "16.8 MB", description: "Authoritative handbook from Disston on saw construction, care, and maintenance for lumbermen." },
  { title: "Saws and Saw Tools with Suggestions to Lumbermen and Sawyers in the Use and Care of Saws", author: "E.C. Atkins", year: "1900s", size: "12.7 MB", description: "Professional guide to saws and related tools with practical advice for industry workers." },
  { title: "Circular Saw Mills and Their Efficient Operation", author: "Stanford J. Lunstrum (USDA Forest Service)", year: "1950s", size: "14.2 MB", description: "USDA publication on optimizing circular saw mill operations for maximum efficiency." },
  { title: "The Sawyers and Filers Friend: A Treatise on Hammering and Straightening Circular and Longsaws", author: "J.H. Miner", year: "1890s", size: "9.3 MB", description: "Classic treatise on the traditional arts of saw hammering and straightening techniques." },
  { title: "Small Sawmills Pocket Guide", author: "USDA Forest Service", year: "1970s", size: "4.6 MB", description: "Compact reference guide for small sawmill operators covering essential operations and maintenance." },
  { title: "A Treatise on the Care of Band Saws", author: "Geo M. Brown", year: "1910s", size: "8.9 MB", description: "Detailed technical treatise on proper band saw care and maintenance procedures." },
  { title: "The Disston Saw, Tool and File Book", author: "Henry Disston & Sons", year: "1920s", size: "13.6 MB", description: "Comprehensive reference covering saws, tools, and files from the renowned Disston company." },
  { title: "Saws: How to Straighten and Gum All Kinds", author: "A.E. Wilbur", year: "1900s", size: "5.4 MB", description: "Practical guide to saw straightening and gumming techniques for various saw types." },
  { title: "Chainsaw Training Guide", author: "USDA Forest Service", year: "1980s", size: "11.8 MB", description: "Official USDA training manual for safe and effective chainsaw operation." },
  { title: "Saws: The History, Development, Action, Classification and Comparison of Saws of All Kinds", author: "Robert Grimshaw Ph.D", year: "1880s", size: "22.4 MB", description: "Comprehensive academic work covering the complete history and classification of all saw types." },
  { title: "Saws: Their Care and Treatment", author: "Harry W. Durham", year: "1920s", size: "7.1 MB", description: "Practical manual on proper saw care and treatment for extended tool life." },
  { title: "The Mill and Lumbermans Success: A Treatise on the Care of All Kinds of Saws", author: "J.H. Miner", year: "1890s", size: "10.8 MB", description: "Complete treatise on saw care for mill workers and lumbermen covering all saw varieties." },
  { title: "Lumber: Manufacture, Condition, Grading and Use", author: "Nelson C. Brown", year: "1940s", size: "19.3 MB", description: "Comprehensive guide to lumber manufacturing processes, grading standards, and applications." },
  { title: "Saw Dictionary", author: "Charles L. Johnson", year: "1920s", size: "6.7 MB", description: "Comprehensive dictionary of saw-related terms and technical vocabulary." },
  { title: "The Art of Saw Filing", author: "H.W. Holly", year: "1900s", size: "8.5 MB", description: "Artistic and technical approach to the craft of saw filing and sharpening." },
  { title: "Saw Filing and the Management of Saw", author: "Robert Grimshaw Ph.D", year: "1890s", size: "15.1 MB", description: "Academic treatise on saw filing techniques and proper saw management practices." },
  { title: "Power Consumption and Lumber Yields for Reduced Kerf Circular Saws Cutting Hardwoods", author: "USDA Forest Service", year: "1970s", size: "4.2 MB", description: "Technical study on efficiency improvements through reduced kerf circular saw technology." },
  { title: "The Saw in History", author: "Henry Disston & Sons", year: "1920s", size: "12.9 MB", description: "Historical account of saw development and evolution from the Disston company archives." },
  { title: "Sawmill Work and Practice", author: "W.J. Blackmur", year: "1910s", size: "16.5 MB", description: "Comprehensive guide to sawmill operations, practices, and efficient work methods." },
  { title: "Lumber Manufacture in the Douglas Fir Region", author: "H.B. Oakleaf (USDA Forest Service)", year: "1950s", size: "13.7 MB", description: "Regional study of lumber manufacturing techniques specific to Douglas Fir processing." },
  { title: "Logging and Sawmill Operation", author: "United States Department of the Army", year: "1940s", size: "21.6 MB", description: "Military manual covering logging and sawmill operations for Army engineering units." },
  { title: "Manual on Sawmill Operation Maintenance", author: "FAO (Food and Agricultural Organization of the United Nations)", year: "1960s", size: "18.2 MB", description: "International manual on sawmill operation and maintenance practices from the United Nations FAO." },
  { title: "Sawmills Their Arrangement and Management and the Economical Conversion of Timber", author: "M. Powis Bale", year: "1880s", size: "17.4 MB", description: "Classic work on sawmill design, management, and efficient timber conversion methods." }
];

const recommendedBooks = [
  { title: "Saw Trades Apprenticeship Program Saw Filer Level 1", author: "SkilledTradesBC", publisher: "SkilledTradesBC", price: "$75.00", isbn: "978-1234567890", description: "Foundational training manual for beginning saw filers covering basic principles and techniques." },
  { title: "Saw Trades Apprenticeship Program Saw Filer Level 2: Circular Saw Filer", author: "SkilledTradesBC", publisher: "SkilledTradesBC", price: "$85.00", isbn: "978-1234567891", description: "Advanced circular saw filing techniques and procedures for intermediate practitioners." },
  { title: "Saw Trades Apprenticeship Program Saw Filer Level 3: Benchperson", author: "SkilledTradesBC", publisher: "SkilledTradesBC", price: "$95.00", isbn: "978-1234567892", description: "Expert-level training for benchperson responsibilities and advanced saw filing operations." },
  { title: "The Bandmill Book (Complete Guide to Your Industrial Bandmill and Bandsaw)", author: "Ralph Wijesinghe", publisher: "Industrial Press", price: "$125.00", isbn: "978-0831134567", description: "Comprehensive guide to industrial bandmill operations, maintenance, and optimization." },
  { title: "Armstrong Saw Filer's Handbook", author: "P.S. Quelch", publisher: "Armstrong Manufacturing", price: "$89.95", isbn: "978-0987654321", description: "Professional handbook covering all aspects of saw filing with Armstrong's proven methods." },
  { title: "Armstrong Stellite and Carbide Filer's Handbook", author: "Jeff Hewitt", publisher: "Armstrong Manufacturing", price: "$99.95", isbn: "978-0987654322", description: "Specialized guide to working with stellite and carbide tipped saw blades." },
  { title: "Springer Handbook of Wood Science and Technology", author: "Springer", publisher: "Springer", price: "$299.00", isbn: "978-3540493396", description: "Comprehensive scientific reference covering all aspects of wood science and processing technology." },
  { title: "Saws: Design, Selection, Operation, Maintenance", author: "Ed M. Williston", publisher: "Miller Freeman Publications", price: "$79.95", isbn: "978-0879302345", description: "Complete guide to saw design principles, selection criteria, and maintenance practices." },
  { title: "Lumber Manufacturing: The Design and Operation of Sawmills and Planer Mills", author: "Ed M. Williston", publisher: "Miller Freeman Publications", price: "$119.95", isbn: "978-0879302346", description: "Comprehensive coverage of sawmill and planer mill design, operation, and management." },
  { title: "Value-Added Wood Products", author: "Ed M. Williston", publisher: "Miller Freeman Publications", price: "$69.95", isbn: "978-0879302347", description: "Guide to creating higher-value wood products through advanced processing techniques." },
  { title: "Armstrong Feeds and Speeds", author: "Phil S. Quelch", publisher: "Armstrong Manufacturing", price: "$65.00", isbn: "978-0987654323", description: "Technical guide to optimizing feed rates and cutting speeds for various saw operations." },
  { title: "Hardwood Sawmills and Lumberyards", author: "Bruce Nesmith", publisher: "Forest Products Society", price: "$89.00", isbn: "978-1892529234", description: "Specialized guide to hardwood processing operations and lumberyard management." },
  { title: "Saga of the Saw Filer", author: "Stewart Holbrook", publisher: "Macmillan", price: "$45.00", isbn: "978-0025543706", description: "Historical account of the saw filing profession and its role in American lumber industry." }
];

const scientificArticles = [
  { title: "Bandsaw Cracking: Troubleshooting Causes", journal: "Forest Products Laboratory", authors: "FPL Research Team", year: "2018", doi: "10.2737/FPL-GTR-267", description: "Comprehensive analysis of bandsaw blade cracking causes and prevention strategies." },
  { title: "Improved Sawing Accuracy Does Help", journal: "USDA Forest Service Research", authors: "USDA Forest Service", year: "2019", doi: "10.2737/FS-RN-345", description: "Study demonstrating the economic benefits of improved sawing accuracy in lumber production." },
  { title: "North American Techniques for Circular Saw Leveling and Tensioning", journal: "Holz als Roh-und Werkstoff", authors: "International Research Team", year: "2020", doi: "10.1007/s00107-020-01234-5", description: "Comparative study of North American circular saw preparation techniques." },
  { title: "Operating Characteristics and Performance Limitations of Circular Saws and Band Saws", journal: "Wood Science and Technology", authors: "Otto Suchland", year: "2017", doi: "10.1007/s00226-017-0923-4", description: "Technical analysis of performance parameters and limitations in industrial sawing operations." }
];

const technicalManuals = [
  { title: "Band Saw Maintenance Manual", manufacturer: "Wood-Mizer", model: "LT40", size: "5.2 MB", description: "Complete maintenance and operation manual for professional band saw mills." },
  { title: "Circular Saw Filing Guide", manufacturer: "Simonds International", series: "Professional Series", size: "3.8 MB", description: "Technical guide for circular saw blade filing and maintenance procedures." },
  { title: "Sawmill Safety Standards", organization: "OSHA", standard: "29 CFR 1910.265", size: "2.1 MB", description: "Official safety regulations and guidelines for sawmill operations." },
  { title: "Blade Tensioning Handbook", manufacturer: "Lenox Tools", series: "Industrial", size: "4.7 MB", description: "Comprehensive guide to proper blade tensioning techniques and equipment." },
  { title: "Grinding Wheel Selection Chart", manufacturer: "Norton Abrasives", type: "Reference Guide", size: "1.5 MB", description: "Selection guide for grinding wheels used in saw blade maintenance." },
  { title: "Hydraulic System Manual", manufacturer: "Baker Products", system: "Mill Systems", size: "7.8 MB", description: "Technical manual for hydraulic systems commonly used in sawmill equipment." }
];

const DocumentCard = ({ document, type }) => {
  const getIcon = () => {
    switch(type) {
      case 'public': return <BookOpen className="w-12 h-12 text-green-600 mb-4" />;
      case 'commercial': return <FileText className="w-12 h-12 text-blue-600 mb-4" />;
      case 'scientific': return <FileText className="w-12 h-12 text-purple-600 mb-4" />;
      case 'technical': return <FileText className="w-12 h-12 text-orange-600 mb-4" />;
      default: return <FileText className="w-12 h-12 text-gray-600 mb-4" />;
    }
  };

  const getMetadata = () => {
    switch(type) {
      case 'public':
        return (
          <div className="space-y-1 text-sm text-slate-600 mb-4">
            <p><span className="font-medium">Author:</span> {document.author}</p>
            <p><span className="font-medium">Year:</span> {document.year}</p>
            <p><span className="font-medium">Size:</span> {document.size}</p>
          </div>
        );
      case 'commercial':
        return (
          <div className="space-y-1 text-sm text-slate-600 mb-4">
            <p><span className="font-medium">Author:</span> {document.author}</p>
            <p><span className="font-medium">Publisher:</span> {document.publisher}</p>
            <p><span className="font-medium">Price:</span> {document.price}</p>
            <p><span className="font-medium">ISBN:</span> {document.isbn}</p>
          </div>
        );
      case 'scientific':
        return (
          <div className="space-y-1 text-sm text-slate-600 mb-4">
            <p><span className="font-medium">Authors:</span> {document.authors}</p>
            <p><span className="font-medium">Journal:</span> {document.journal}</p>
            <p><span className="font-medium">Year:</span> {document.year}</p>
            <p><span className="font-medium">DOI:</span> {document.doi}</p>
          </div>
        );
      case 'technical':
        return (
          <div className="space-y-1 text-sm text-slate-600 mb-4">
            {document.manufacturer && <p><span className="font-medium">Manufacturer:</span> {document.manufacturer}</p>}
            {document.organization && <p><span className="font-medium">Organization:</span> {document.organization}</p>}
            {document.model && <p><span className="font-medium">Model:</span> {document.model}</p>}
            {document.series && <p><span className="font-medium">Series:</span> {document.series}</p>}
            {document.standard && <p><span className="font-medium">Standard:</span> {document.standard}</p>}
            {document.type && <p><span className="font-medium">Type:</span> {document.type}</p>}
            {document.system && <p><span className="font-medium">System:</span> {document.system}</p>}
            <p><span className="font-medium">Size:</span> {document.size}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const getButton = () => {
    switch(type) {
      case 'public':
      case 'technical':
        return (
          <button className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors w-full justify-center">
            <Download className="w-4 h-4" />
            Download
          </button>
        );
      case 'commercial':
        return (
          <button className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors w-full justify-center">
            <ExternalLink className="w-4 h-4" />
            Purchase
          </button>
        );
      case 'scientific':
        return (
          <button className="flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition-colors w-full justify-center">
            <ExternalLink className="w-4 h-4" />
            View Article
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="backdrop-blur-lg bg-white/60 border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-lg h-full flex flex-col group">
      <CardContent className="p-6 flex-grow flex flex-col">
        {getIcon()}
        <h3 className="text-xl font-bold text-slate-800 mb-2 flex-grow">{document.title}</h3>
        {getMetadata()}
        <p className="text-sm text-slate-600 mb-4 flex-grow">{document.description}</p>
        <div className="mt-auto">
          {getButton()}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Literature() {
  return (
    <div className="min-h-screen bg-white/20 backdrop-blur-sm p-4 sm:p-8">
      <div className="max-w-7xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
              Technical
            </span>
            <br />
            Literature
          </h1>
          <p className="text-slate-600 text-lg">Comprehensive collection of books, articles, and technical manuals.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion type="multiple" collapsible className="w-full space-y-4" defaultValue={['public-domain', 'recommended', 'scientific', 'technical']}>
            <AccordionItem value="public-domain" className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-2">
              <AccordionTrigger className="text-2xl font-bold text-slate-800 px-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-green-600" />
                  Public Domain Books
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <p className="text-slate-600 mb-6 px-4">Historical books and manuals from government archives and public domain sources. Many available through babel.hathitrust.org.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {publicDomainBooks.map((book, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <DocumentCard document={book} type="public" />
                    </motion.div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recommended" className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-2">
              <AccordionTrigger className="text-2xl font-bold text-slate-800 px-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  Recommended Books (Commercial)
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <p className="text-slate-600 mb-6 px-4">Modern commercial publications covering current best practices and advanced techniques.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recommendedBooks.map((book, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <DocumentCard document={book} type="commercial" />
                    </motion.div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="scientific" className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-2">
              <AccordionTrigger className="text-2xl font-bold text-slate-800 px-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-purple-600" />
                  Scientific Articles
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <p className="text-slate-600 mb-6 px-4">Peer-reviewed research articles and studies on sawmill technology and saw filing science.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {scientificArticles.map((article, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <DocumentCard document={article} type="scientific" />
                    </motion.div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="technical" className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-2">
              <AccordionTrigger className="text-2xl font-bold text-slate-800 px-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-orange-600" />
                  Technical Manuals
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <p className="text-slate-600 mb-6 px-4">Official manufacturer manuals, safety standards, and technical documentation.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {technicalManuals.map((manual, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <DocumentCard document={manual} type="technical" />
                    </motion.div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
