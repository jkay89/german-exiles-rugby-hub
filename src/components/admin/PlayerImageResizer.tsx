
import React, { useState, useRef, useEffect } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";

interface PlayerImageResizerProps {
  open: boolean;
  onClose: () => void;
  onSave: (resizedFile: File) => void;
  initialImage: File | null;
  playerName: string;
}

const PlayerImageResizer: React.FC<PlayerImageResizerProps> = ({
  open,
  onClose,
  onSave,
  initialImage,
  playerName,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Load the image when the component mounts or initialImage changes
  useEffect(() => {
    if (initialImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
        
        // Reset scale and position when a new image is loaded
        setScale(1);
        setPosition({ x: 0, y: 0 });
        
        // Create an image element to get dimensions
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(initialImage);
    }
  }, [initialImage]);
  
  // Handle mouse down event for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageUrl) {
      setDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Handle mouse move event for dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    setDragging(false);
  };

  // Handle saving the resized image
  const handleSave = () => {
    if (!canvasRef.current || !imageRef.current || !imageUrl) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size to match the avatar size (square)
    canvas.width = 300;
    canvas.height = 300;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate the center of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Calculate scaling and positioning
    const drawWidth = imageRef.current.width * scale;
    const drawHeight = imageRef.current.height * scale;
    
    // Draw the image with transformations
    ctx.save();
    
    // Start with a circle clip path
    ctx.beginPath();
    ctx.arc(centerX, centerY, canvas.width / 2, 0, Math.PI * 2);
    ctx.clip();
    
    ctx.drawImage(
      imageRef.current,
      centerX - drawWidth / 2 + position.x,
      centerY - drawHeight / 2 + position.y,
      drawWidth,
      drawHeight
    );
    
    ctx.restore();
    
    // Convert the canvas to a blob and create a new File
    canvas.toBlob((blob) => {
      if (blob) {
        const fileName = initialImage?.name || "resized-image.jpg";
        const resizedFile = new File([blob], fileName, {
          type: 'image/jpeg',
          lastModified: new Date().getTime()
        });
        
        onSave(resizedFile);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>Resize Player Image</DialogTitle>
          <DialogDescription className="text-gray-400">
            Drag to position and use the slider to resize the image before saving.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="relative">
            <div 
              className="relative h-64 w-64 rounded-full overflow-hidden border-2 border-gray-700 cursor-move"
              style={{ 
                touchAction: "none",
                backgroundColor: "#1e1e1e"
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {imageUrl && (
                <div 
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                      maxWidth: 'none'
                    }}
                  />
                </div>
              )}
            </div>
            <div className="text-center mt-2 text-sm text-gray-400">
              Drag to position
            </div>
          </div>
          
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Zoom</span>
              </div>
              <ZoomIn className="h-4 w-4 text-gray-400" />
            </div>
            
            <Slider 
              value={[scale]} 
              onValueChange={(values) => setScale(values[0])} 
              min={0.5} 
              max={3} 
              step={0.1}
              className="w-full"
            />
          </div>
          
          <div className="w-full bg-gray-800 p-4 rounded-md border border-gray-700">
            <div className="text-gray-400 mb-2 text-sm">Preview</div>
            <div className="flex items-center space-x-3">
              <Avatar className="h-16 w-16">
                {imageUrl ? (
                  <AvatarImage 
                    src={imageUrl}
                    style={{
                      transform: `translate(${position.x * 0.25}px, ${position.y * 0.25}px) scale(${scale})`,
                      transformOrigin: 'center'
                    }}
                    alt="Preview" 
                  />
                ) : (
                  <AvatarFallback className="bg-german-red text-white">
                    {playerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="font-medium">{playerName}</div>
                <div className="text-xs text-gray-500">How it will appear</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-gray-800 hover:bg-gray-700">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-german-red hover:bg-german-gold">
            Save Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerImageResizer;
