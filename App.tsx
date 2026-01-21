import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateLoremIpsum } from './utils/lorem';
import { Button } from './components/ui/Button';
import { Slider } from './components/ui/Slider';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { Copy, RefreshCw, Check, Settings2, FileText, Type } from 'lucide-react';

const App: React.FC = () => {
  const [numParagraphs, setNumParagraphs] = useState<number>(3);
  const [numSentences, setNumSentences] = useState<number>(5);
  const [text, setText] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Debounce ref to avoid generating too frequently while sliding on mobile
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generate = useCallback((paragraphs: number, sentences: number) => {
    // Safety check for generation
    const p = Math.max(0, paragraphs);
    const s = Math.max(0, sentences);
    const generated = generateLoremIpsum(p, s);
    setText(generated);
  }, []);

  // Initial generation
  useEffect(() => {
    generate(numParagraphs, numSentences);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleParagraphsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    
    // Handle empty or invalid input
    if (isNaN(val)) val = 0;
    
    // Clamp to max 100
    if (val > 100) val = 100;
    
    setNumParagraphs(val);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Only generate if we have a valid count, otherwise wait (UX choice)
    // Generating with 0 clears the text, which is valid feedback.
    timeoutRef.current = setTimeout(() => generate(val, numSentences), 50);
  };

  const handleSentencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    
    if (isNaN(val)) val = 0;
    if (val > 100) val = 100;

    setNumSentences(val);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => generate(numParagraphs, val), 50);
  };

  const handleCopy = async () => {
    const content = text.join('\n\n');
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleRegenerate = () => {
    generate(numParagraphs, numSentences);
    setCopied(false);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 text-slate-900 pb-20">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <span className="font-serif font-bold italic text-lg">L</span>
            </div>
            <h1 className="font-bold text-lg tracking-tight hidden sm:block">InstaLorem</h1>
          </div>

          <div className="flex items-center gap-2">
             <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleControls}
              className="sm:hidden"
              aria-label="Toggle settings"
            >
              <Settings2 className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRegenerate}
              className="hidden sm:flex gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>

            <Button 
              variant="primary" 
              size="sm"
              onClick={handleCopy}
              className={`transition-all duration-200 ${copied ? 'bg-green-600 hover:bg-green-700' : ''}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Controls Drawer - Visible when showControls is true */}
        <div className={`
          border-b bg-white/90 backdrop-blur overflow-hidden transition-all duration-300 ease-in-out
          ${showControls ? 'max-h-64 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}
        `}>
          <div className="max-w-3xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Slider
              label="Paragraphs"
              min={1}
              max={100}
              value={numParagraphs}
              onChange={handleParagraphsChange}
            />
            <Slider
              label="Sentences per Paragraph"
              min={1}
              max={100}
              value={numSentences}
              onChange={handleSentencesChange}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl mx-auto p-4 flex-grow flex flex-col gap-6">
        
        {/* Output Card */}
        <Card className="flex-grow shadow-md border-slate-200 overflow-hidden bg-white">
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full" />
          <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500">
               <FileText className="w-4 h-4" />
               <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                 {text.length} Para • {text.length * numSentences} Sentences
               </span>
            </div>
             {/* Mobile Regenerate Icon (Header is too crowded) */}
             <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRegenerate}
              className="sm:hidden h-8 w-8 text-slate-500"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="font-serif leading-relaxed text-slate-700 p-6 md:p-8 space-y-6">
            {text.length > 0 ? (
              text.map((para, idx) => (
                <p key={idx} className="text-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {para}
                </p>
              ))
            ) : (
               <div className="text-center py-10 text-slate-400 italic">
                 No text generated. Increase paragraphs or sentences.
               </div>
            )}
          </CardContent>
        </Card>

      </main>

      {/* Footer Info */}
      <footer className="w-full text-center py-6 text-slate-400 text-sm">
        <p>Fully offline. No AI. Just Lorem Ipsum.</p>
      </footer>
    </div>
  );
};

export default App;