
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Menu, X, Download } from 'lucide-react';

// --- Configuration Constants ---
const GRID_SIZE = 15;
const UNIT_WIDTH = 8;
const UNIT_HEIGHT = 9.6;
const PLATE_HEIGHT = UNIT_HEIGHT / 3;
const STUD_HEIGHT = 1.8;
const STUD_RADIUS = 2.4;
const STUD_SEGMENTS = 12;
const BEVEL_SIZE = 0.2;

const COLORS = {
  white: { hex: 0xF2F3F2, name: 'white', tailwind: 'bg-[#F2F3F2]' },
  blue: { hex: 0x0055BF, name: 'blue', tailwind: 'bg-[#0055BF]' },
  yellow: { hex: 0xFAB000, name: 'yellow', tailwind: 'bg-[#FAB000]' },
  orange: { hex: 0xFF6B00, name: 'orange', tailwind: 'bg-[#FF6B00]' },
  black: { hex: 0x05131D, name: 'black', tailwind: 'bg-[#05131D]' },
  darkblue: { hex: 0x002060, name: 'darkblue', tailwind: 'bg-[#002060]' },
  gray: { hex: 0xA0A5A9, name: 'gray', tailwind: 'bg-[#A0A5A9]' }
};

// --- Helper Components ---
const ColorPalette = ({ selectedColor, onColorSelect }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-4">
    {Object.values(COLORS).map(color => (
      <button
        key={color.name}
        aria-label={`Select ${color.name}`}
        title={`Select ${color.name}`}
        className={`w-8 h-8 rounded-md border-2 transition-all duration-150 ease-in-out transform hover:scale-110 ${
          selectedColor.name === color.name
            ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-200'
            : 'border-gray-400 hover:border-gray-600'
        }`}
        style={{ backgroundColor: `#${color.hex.toString(16).padStart(6, '0')}` }}
        onClick={() => onColorSelect(color)}
      />
    ))}
  </div>
);

const Grid2D = ({ gridSize, gridContainerRef, gridCells }) => (
    <div
        ref={gridContainerRef}
        className="w-full h-full border-2 border-gray-500 bg-gray-400 grid cursor-crosshair touch-none shadow-inner select-none relative rounded-md"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
    >
        {gridCells.map(({ x, z, id }) => (
            <div
                key={id}
                id={id}
                className="grid-cell-container box-border relative min-w-0 min-h-0 transition-colors duration-100 ease-in-out"
                data-coord={`${x},${z}`}
            >
                <div className="stud-visual w-[65%] h-[65%] absolute top-[17.5%] left-[17.5%] rounded-full bg-black/10 shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.2),inset_0px_-1px_1px_0px_rgba(0,0,0,0.1)] pointer-events-none z-10"></div>
            </div>
        ))}
    </div>
);

const Instructions = () => (
    <div className="mt-auto pt-4 border-t border-gray-300 text-xs text-gray-600">
        <p className="font-bold mb-1">Controls:</p>
        <ul className="list-disc list-inside space-y-1">
            <li><b>Click & Drag</b> on the 2D grid to place bricks.</li>
            <li><b>Mouse Wheel / Two-Finger Pinch:</b> Zoom in/out (3D View).</li>
            <li><b>Click & Drag / One-Finger Drag:</b> Rotate view (3D View).</li>
            <li><b>Two-Finger Drag:</b> Pan view (3D View).</li>
        </ul>
    </div>
);

// Enhanced camera controls class with reset and touch functionality
class SimpleControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.target = new THREE.Vector3(0, UNIT_HEIGHT * 1.5, 0);
        this.isMouseDown = false;
        this.touchStart = null; // For single touch rotation
        this.lastTouchDistance = null; // For two-finger pinch zoom
        this.lastTouchPosition = null; // For two-finger pan
        this.mouseX = 0;
        this.mouseY = 0;
        this.phi = Math.PI / 4;
        this.theta = Math.PI / 4;
        this.radius = GRID_SIZE * UNIT_WIDTH * 2;
        
        // Store initial values for reset
        this.initialPhi = Math.PI / 4;
        this.initialTheta = Math.PI / 4;
        this.initialRadius = GRID_SIZE * UNIT_WIDTH * 2;
        
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        
        this.domElement.addEventListener('mousedown', this.onMouseDown);
        this.domElement.addEventListener('mousemove', this.onMouseMove);
        this.domElement.addEventListener('mouseup', this.onMouseUp);
        this.domElement.addEventListener('wheel', this.onWheel);
        this.domElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
        this.domElement.addEventListener('touchmove', this.onTouchMove, { passive: false });
        this.domElement.addEventListener('touchend', this.onTouchEnd, { passive: false });
        
        this.update();
    }
    
    onMouseDown(event) {
        this.isMouseDown = true;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }
    
    onMouseMove(event) {
        if (!this.isMouseDown) return;
        
        const deltaX = event.clientX - this.mouseX;
        const deltaY = event.clientY - this.mouseY;
        
        // Fix inverted controls:
        this.theta += deltaX * 0.01; // Positive deltaX (move right) rotates right
        this.phi -= deltaY * 0.01; // Negative deltaY (move up) rotates up
        this.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.01, this.phi)); // Prevent looking under base
        
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        
        this.update();
    }
    
    onMouseUp() {
        this.isMouseDown = false;
    }
    
    onWheel(event) {
        this.radius += event.deltaY * 0.1; // Positive deltaY (scroll down) zooms out
        this.radius = Math.max(50, Math.min(500, this.radius));
        this.update();
    }

    onTouchStart(event) {
        event.preventDefault(); // Prevent scrolling and other default behaviors
        if (event.touches.length === 1) {
            this.touchStart = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
            };
        } else if (event.touches.length === 2) {
            this.lastTouchDistance = Math.hypot(
                event.touches[0].clientX - event.touches[1].clientX,
                event.touches[0].clientY - event.touches[1].clientY
            );
            this.lastTouchPosition = {
                x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
                y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
            };
        }
    }

    onTouchMove(event) {
        event.preventDefault(); // Prevent scrolling and other default behaviors
        if (event.touches.length === 1) {
            if (!this.touchStart) return;
            const deltaX = event.touches[0].clientX - this.touchStart.x;
            const deltaY = event.touches[0].clientY - this.touchStart.y;

            this.theta += deltaX * 0.01;
            this.phi -= deltaY * 0.01;
            this.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.01, this.phi));

            this.touchStart.x = event.touches[0].clientX;
            this.touchStart.y = event.touches[0].clientY;
        } else if (event.touches.length === 2) {
            const currentTouchDistance = Math.hypot(
                event.touches[0].clientX - event.touches[1].clientX,
                event.touches[0].clientY - event.touches[1].clientY
            );
            const currentTouchPosition = {
                x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
                y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
            };

            // Zoom
            const deltaDistance = currentTouchDistance - this.lastTouchDistance;
            this.radius -= deltaDistance * 0.2; // Pinch out (positive deltaDistance) zooms in (decreases radius)
            this.radius = Math.max(50, Math.min(500, this.radius));

            // Pan
            const deltaX = currentTouchPosition.x - this.lastTouchPosition.x;
            const deltaY = currentTouchPosition.y - this.lastTouchPosition.y;

            // Pan by moving the target point
            const panSpeed = 0.5;
            const cameraDirection = new THREE.Vector3();
            this.camera.getWorldDirection(cameraDirection);
            const right = new THREE.Vector3().crossVectors(cameraDirection, this.camera.up).normalize();
            const up = new THREE.Vector3().copy(this.camera.up).normalize(); // Use camera's up vector directly

            this.target.add(right.multiplyScalar(-deltaX * panSpeed)); // Inverted deltaX for intuitive pan
            this.target.add(up.multiplyScalar(deltaY * panSpeed));    // Inverted deltaY for intuitive pan

            this.lastTouchDistance = currentTouchDistance;
            this.lastTouchPosition = currentTouchPosition;
        } else {
            return; // Ignore more than 2 fingers
        }
        this.update();
    }

    onTouchEnd(event) {
        this.touchStart = null;
        this.lastTouchDistance = null;
        this.lastTouchPosition = null;
    }
    
    reset() {
        this.phi = this.initialPhi;
        this.theta = this.initialTheta;
        this.radius = this.initialRadius;
        this.target.set(0, UNIT_HEIGHT * 1.5, 0);
        this.update();
    }
    
    update() {
        const x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
        const y = this.radius * Math.cos(this.phi);
        const z = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.target);
    }
    
    dispose() {
        this.domElement.removeEventListener('mousedown', this.onMouseDown);
        this.domElement.removeEventListener('mousemove', this.onMouseMove);
        this.domElement.removeEventListener('mouseup', this.onMouseUp);
        this.domElement.removeEventListener('wheel', this.onWheel);
        this.domElement.removeEventListener('touchstart', this.onTouchStart);
        this.domElement.removeEventListener('touchmove', this.onTouchMove);
        this.domElement.removeEventListener('touchend', this.onTouchEnd);
    }
}

export default function RSLegoBuilder({ logoSrc = "https://reliabilitysolutions.net/wp-content/uploads/2024/05/logo.webp" }) {
    const sceneContainerRef = useRef(null);
    const gridContainerRef = useRef(null);
    const mobileGridContainerRef = useRef(null); // Separate ref for mobile grid

    const threeState = useRef({});
    const logicState = useRef({
        occupiedCells: {},
        brickHistory: [],
        isDragging: false,
        dragStartCoords: null,
        dragCurrentCoords: null,
        currentSelection: new Set(),
    });

    const [selectedColor, setSelectedColor] = useState(COLORS.blue);
    const [gridCells, setGridCells] = useState([]);
    const [showControlsPanel, setShowControlsPanel] = useState(false); // State for mobile control panel visibility

    const updateCellAppearance = useCallback((gridX, gridZ, classNames = [], hasStuds = false) => {
        const desktopGrid = gridContainerRef.current;
        const mobileGrid = mobileGridContainerRef.current;
        let targetGrid = null;

        // Determine which grid is active. A visible element has a non-null offsetParent.
        // offsetParent is null if the element or its parent is display: none.
        if (mobileGrid && mobileGrid.offsetParent !== null) {
            targetGrid = mobileGrid;
        } else if (desktopGrid && desktopGrid.offsetParent !== null) {
            targetGrid = desktopGrid;
        } else {
            // Fallback for edge cases, prefer mobile if it exists (might be during initial render before visibility is set)
            targetGrid = mobileGrid || desktopGrid;
        }
        
        const cellElement = targetGrid?.querySelector(`#cell-${gridX}-${gridZ}`);

        if (!cellElement) return;

        // Clear previous state
        cellElement.innerHTML = ''; // Clear any old studs
        cellElement.className = 'grid-cell-container box-border relative min-w-0 min-h-0 transition-colors duration-100 ease-in-out';
        
        classNames.forEach(cls => {
            if (cls) cellElement.classList.add(cls);
        });
        
        if (hasStuds) {
            const stud = document.createElement('div');
            stud.className = "stud-visual w-[65%] h-[65%] absolute top-[17.5%] left-[17.5%] rounded-full bg-black/20 shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.4)] pointer-events-none z-10";
            cellElement.appendChild(stud);
        } else {
             // Default baseplate stud
            const stud = document.createElement('div');
            stud.className = "stud-visual w-[65%] h-[65%] absolute top-[17.5%] left-[17.5%] rounded-full bg-black/10 shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.2),inset_0px_-1px_1px_0px_rgba(0,0,0,0.1)] pointer-events-none z-10";
            if(classNames.length > 0) stud.style.display = 'none';
            cellElement.appendChild(stud);
        }
    }, []);
    
    const getCellColorClass = useCallback((x, z) => {
        const key = `${x}_${z}`;
        const height = logicState.current.occupiedCells[key] || 0;
        if (height === 0) return null;

        const brick = logicState.current.brickHistory.find(b => {
            const p = b.placement;
            return p.yLevel === height - 1 && x >= p.gridX && x < p.gridX + p.widthUnits && z >= p.gridZ && z < p.gridZ + p.depthUnits;
        });

        return brick ? COLORS[brick.placement.colorName].tailwind : COLORS.gray.tailwind;
    }, []);

    const refreshGridAppearance = useCallback(() => {
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let z = 0; z < GRID_SIZE; z++) {
                const colorClass = getCellColorClass(x, z);
                updateCellAppearance(x, z, colorClass ? [colorClass] : [], !!colorClass);
            }
        }
    }, [getCellColorClass, updateCellAppearance]);

    const updateSelectionHighlight = useCallback(() => {
        const { dragStartCoords, dragCurrentCoords, currentSelection } = logicState.current;
        const newSelection = new Set();

        if (dragStartCoords && dragCurrentCoords) {
            const x1 = Math.min(dragStartCoords.x, dragCurrentCoords.x);
            const x2 = Math.max(dragStartCoords.x, dragCurrentCoords.x);
            const z1 = Math.min(dragStartCoords.z, dragCurrentCoords.z);
            const z2 = Math.max(dragStartCoords.z, dragCurrentCoords.z);

            for (let x = x1; x <= x2; x++) {
                for (let z = z1; z <= z2; z++) {
                    newSelection.add(`${x},${z}`);
                }
            }
        }
        
        currentSelection.forEach(coord => {
            if (!newSelection.has(coord)) {
                const [x, z] = coord.split(',').map(Number);
                const colorClass = getCellColorClass(x, z);
                updateCellAppearance(x, z, colorClass ? [colorClass] : [], !!colorClass);
            }
        });

        newSelection.forEach(coord => {
            if (!currentSelection.has(coord)) {
                const [x, z] = coord.split(',').map(Number);
                updateCellAppearance(x, z, ['selected', 'bg-blue-500/60'], false);
            }
        });

        logicState.current.currentSelection = newSelection;
    }, [getCellColorClass, updateCellAppearance]);

    const addBrickToScene = useCallback((brickData) => {
        if (!brickData) return;
        const { mesh, placement } = brickData;
        threeState.current.scene.add(mesh);
        logicState.current.brickHistory.push(brickData);

        for (let x = placement.gridX; x < placement.gridX + placement.widthUnits; x++) {
            for (let z = placement.gridZ; z < placement.gridZ + placement.depthUnits; z++) {
                logicState.current.occupiedCells[`${x}_${z}`] = placement.yLevel + 1;
            }
        }
        refreshGridAppearance();
    }, [refreshGridAppearance]);

    const createBrickMesh = useCallback((gridX, gridZ, widthUnits, depthUnits, color) => {
        const { brickGeometries, brickMaterials } = threeState.current;

        const getMaterial = (colorHex) => {
            const key = colorHex.toString(16);
            if (!brickMaterials[key]) {
                brickMaterials[key] = new THREE.MeshStandardMaterial({
                    color: colorHex, 
                    roughness: 0.3, 
                    metalness: 0.1,
                });
            }
            return brickMaterials[key];
        };

        const getBrickGeometry = (w, d) => {
            const key = `${w}_${d}`;
            if (!brickGeometries[key]) {
                const brickWidth = w * UNIT_WIDTH;
                const brickDepth = d * UNIT_WIDTH;
                const brickHeight = UNIT_HEIGHT;
                
                // Create main brick body with rounded edges
                const mainBox = new THREE.BoxGeometry(
                    brickWidth - BEVEL_SIZE * 2, 
                    brickHeight - BEVEL_SIZE, 
                    brickDepth - BEVEL_SIZE * 2
                );
                mainBox.translate(0, (brickHeight - BEVEL_SIZE) / 2, 0);

                // Create stud geometry if not cached
                let studGeo = brickGeometries['stud'];
                if (!studGeo) {
                    studGeo = new THREE.CylinderGeometry(STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, STUD_SEGMENTS);
                    studGeo.translate(0, STUD_HEIGHT / 2, 0);
                    brickGeometries['stud'] = studGeo;
                }

                // Calculate stud positions
                const studPositions = [];
                for (let x = 0; x < w; x++) {
                    for (let z = 0; z < d; z++) {
                        const studX = (x - (w - 1) / 2) * UNIT_WIDTH;
                        const studZ = (z - (d - 1) / 2) * UNIT_WIDTH;
                        studPositions.push(new THREE.Vector3(studX, brickHeight - BEVEL_SIZE, studZ));
                    }
                }
                brickGeometries[key] = { main: mainBox, stud: studGeo, studPositions };
            }
            return brickGeometries[key];
        };
        
        const { main: mainGeo, stud: studGeo, studPositions } = getBrickGeometry(widthUnits, depthUnits);
        const material = getMaterial(color.hex);
        
        // Validate placement
        let maxExistingHeight = 0;
        const footprintCoords = [];
        for (let x = 0; x < widthUnits; x++) {
            for (let z = 0; z < depthUnits; z++) {
                const currentX = gridX + x;
                const currentZ = gridZ + z;
                if (currentX < 0 || currentX >= GRID_SIZE || currentZ < 0 || currentZ >= GRID_SIZE) return null;
                footprintCoords.push({x: currentX, z: currentZ});
                maxExistingHeight = Math.max(maxExistingHeight, logicState.current.occupiedCells[`${currentX}_${currentZ}`] || 0);
            }
        }

        const targetYLevel = maxExistingHeight;
        for (const { x, z } of footprintCoords) {
            if ((logicState.current.occupiedCells[`${x}_${z}`] || 0) !== targetYLevel) {
                footprintCoords.forEach(({x: fx, z: fz}) => {
                    updateCellAppearance(fx, fz, ['placement-invalid', 'bg-red-500/70'], false); // False for hasStuds, as it's an overlay
                });
                setTimeout(refreshGridAppearance, 350);
                return null;
            }
        }

        // Create brick group with main body and studs
        const brickGroup = new THREE.Group();
        
        // Add main brick body
        const bodyMesh = new THREE.Mesh(mainGeo, material);
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        brickGroup.add(bodyMesh);

        // Add studs on top
        studPositions.forEach(pos => {
            const studMesh = new THREE.Mesh(studGeo, material);
            studMesh.position.copy(pos);
            studMesh.castShadow = true;
            brickGroup.add(studMesh);
        });

        // Position the brick in world space
        const worldX = (gridX + widthUnits / 2 - GRID_SIZE / 2) * UNIT_WIDTH;
        const worldZ = (gridZ + depthUnits / 2 - GRID_SIZE / 2) * UNIT_WIDTH;
        const worldY = targetYLevel * UNIT_HEIGHT;
        brickGroup.position.set(worldX, worldY, worldZ);
        brickGroup.userData = { 
            isBrick: true, 
            gridX, 
            gridZ, 
            widthUnits, 
            depthUnits, 
            colorName: color.name, 
            yLevel: targetYLevel 
        };
        
        return { mesh: brickGroup, placement: brickGroup.userData };
    }, [refreshGridAppearance, updateCellAppearance]);

    const handleUndo = useCallback(() => {
        const { brickHistory, occupiedCells } = logicState.current;
        if (brickHistory.length === 0) return;

        const lastBrickData = brickHistory.pop();
        const { mesh, placement } = lastBrickData;
        threeState.current.scene.remove(mesh);
        mesh.traverse(c => { if (c.isMesh) c.geometry.dispose(); });

        for (let x = placement.gridX; x < placement.gridX + placement.widthUnits; x++) {
            for (let z = placement.gridZ; z < placement.gridZ + placement.depthUnits; z++) {
                let newHeight = 0;
                brickHistory.forEach(brick => {
                    const p = brick.placement;
                    if (x >= p.gridX && x < p.gridX + p.widthUnits && z >= p.gridZ && z < p.gridZ + p.depthUnits) {
                        newHeight = Math.max(newHeight, p.yLevel + 1);
                    }
                });
                if (newHeight > 0) occupiedCells[`${x}_${z}`] = newHeight;
                else delete occupiedCells[`${x}_${z}`];
            }
        }
        refreshGridAppearance();
    }, [refreshGridAppearance]);

    const handleClearAll = useCallback(() => {
        while (logicState.current.brickHistory.length > 0) {
            const brickData = logicState.current.brickHistory.pop();
            threeState.current.scene.remove(brickData.mesh);
            brickData.mesh.traverse(child => { if (child.isMesh) child.geometry.dispose(); });
        }
        logicState.current.occupiedCells = {};
        refreshGridAppearance();
    }, [refreshGridAppearance]);

    const handleClearTopLayer = useCallback(() => {
        const { brickHistory, occupiedCells } = logicState.current;
        if (brickHistory.length === 0) return;

        // Find the maximum height
        let maxHeight = 0;
        Object.values(occupiedCells).forEach(height => {
            maxHeight = Math.max(maxHeight, height);
        });

        if (maxHeight === 0) return;

        // Remove all bricks at the top level
        const bricksToRemove = [];
        // Iterate in reverse to safely remove elements
        for (let i = brickHistory.length - 1; i >= 0; i--) {
            const brickData = brickHistory[i];
            if (brickData.placement.yLevel === maxHeight - 1) {
                bricksToRemove.push({ brickData, index: i });
            }
        }

        // Remove from scene and history (in reverse order of original indices to avoid issues)
        bricksToRemove.forEach(({ brickData, index }) => {
            threeState.current.scene.remove(brickData.mesh);
            // Dispose of geometry and material to free up memory
            brickData.mesh.traverse(child => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose();
                }
            });
            brickHistory.splice(index, 1); // Remove from history
        });

        // Re-calculate occupied cells after removal
        const newOccupiedCells = {};
        brickHistory.forEach(brick => {
            const p = brick.placement;
            for (let x = p.gridX; x < p.gridX + p.widthUnits; x++) {
                for (let z = p.gridZ; z < p.gridZ + p.depthUnits; z++) {
                    const key = `${x}_${z}`;
                    newOccupiedCells[key] = Math.max(newOccupiedCells[key] || 0, p.yLevel + 1);
                }
            }
        });
        logicState.current.occupiedCells = newOccupiedCells;
        
        refreshGridAppearance();
    }, [refreshGridAppearance]);

    const handleResetView = useCallback(() => {
        const { controls } = threeState.current;
        if (controls) {
            controls.reset();
        }
    }, []);

    const handleSaveAsPNG = useCallback(() => {
        const { renderer } = threeState.current;
        if (!renderer) return;

        try {
            // Render the current frame
            // Ensure the renderer canvas is visible and fully rendered before capture
            renderer.render(threeState.current.scene, threeState.current.camera);
            
            // Get the canvas and convert to blob
            const canvas = renderer.domElement;
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `lego-creation-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url); // Clean up the URL object
                }
            }, 'image/png');
        } catch (error) {
            console.error('Error saving PNG:', error);
        }
    }, []);

    // Initialize Three.js scene
    useEffect(() => {
        const sceneContainer = sceneContainerRef.current;
        if (!sceneContainer || threeState.current.scene) return;

        try {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xD0D8E8);
            
            const camera = new THREE.PerspectiveCamera(50, sceneContainer.clientWidth / sceneContainer.clientHeight, 1, 4000);
            camera.position.set(GRID_SIZE * UNIT_WIDTH * 1.1, GRID_SIZE * UNIT_HEIGHT * 1.6, GRID_SIZE * UNIT_WIDTH * 1.9);

            const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            sceneContainer.appendChild(renderer.domElement);

            const controls = new SimpleControls(camera, renderer.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);
            const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
            dirLight1.position.set(GRID_SIZE * UNIT_WIDTH * 0.6, GRID_SIZE * UNIT_HEIGHT * 4, GRID_SIZE * UNIT_WIDTH * 0.8);
            dirLight1.castShadow = true;
            dirLight1.shadow.mapSize.set(2048, 2048);
            scene.add(dirLight1);

            // Base plate
            const basePlateGeo = new THREE.BoxGeometry(GRID_SIZE * UNIT_WIDTH, PLATE_HEIGHT * 0.8, GRID_SIZE * UNIT_WIDTH);
            const basePlateMat = new THREE.MeshStandardMaterial({ color: COLORS.gray.hex, roughness: 0.75 });
            const basePlateMesh = new THREE.Mesh(basePlateGeo, basePlateMat);
            basePlateMesh.position.y = -(PLATE_HEIGHT * 0.8) / 2;
            basePlateMesh.receiveShadow = true;
            scene.add(basePlateMesh);
            
            // Base studs
            const studGeo = new THREE.CylinderGeometry(STUD_RADIUS * 0.9, STUD_RADIUS * 0.95, STUD_HEIGHT * 0.6, STUD_SEGMENTS);
            studGeo.translate(0, STUD_HEIGHT * 0.3, 0);
            const studMeshes = new THREE.InstancedMesh(studGeo, basePlateMat, GRID_SIZE * GRID_SIZE);
            studMeshes.castShadow = true;
            studMeshes.receiveShadow = true;
            
            const dummy = new THREE.Object3D();
            let instanceIndex = 0;
            for (let x = 0; x < GRID_SIZE; x++) {
                for (let z = 0; z < GRID_SIZE; z++) {
                    const worldX = (x - (GRID_SIZE - 1) / 2) * UNIT_WIDTH;
                    const worldZ = (z - (GRID_SIZE - 1) / 2) * UNIT_WIDTH;
                    dummy.position.set(worldX, 0, worldZ);
                    dummy.updateMatrix();
                    studMeshes.setMatrixAt(instanceIndex++, dummy.matrix);
                }
            }
            studMeshes.instanceMatrix.needsUpdate = true;
            scene.add(studMeshes);

            threeState.current = {
                scene, camera, renderer, controls,
                brickMaterials: {}, brickGeometries: {}
            };

            // Render loop
            let animationFrameId;
            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };
            animate();

            // Resize handler - now using ResizeObserver for robustness
            const handleResize = () => {
                if (!sceneContainer) return;
                const { clientWidth, clientHeight } = sceneContainer;
                camera.aspect = clientWidth / clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(clientWidth, clientHeight);
            };
            
            const resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(sceneContainer);
            
            return () => {
                cancelAnimationFrame(animationFrameId);
                resizeObserver.disconnect();
                controls.dispose();
                if (renderer) renderer.dispose();
                if (sceneContainer) sceneContainer.innerHTML = ''; // Clear DOM element
                // Dispose of geometries and materials in threeState.current
                if (threeState.current.brickGeometries) {
                    Object.values(threeState.current.brickGeometries).forEach(geo => {
                        if (geo.main) geo.main.dispose();
                        if (geo.stud) geo.stud.dispose();
                        if (geo.dispose) geo.dispose(); // In case it's a single geometry directly
                    });
                }
                if (threeState.current.brickMaterials) {
                    Object.values(threeState.current.brickMaterials).forEach(mat => mat.dispose());
                }
                // Clear state
                threeState.current = {};
                logicState.current = {
                    occupiedCells: {},
                    brickHistory: [],
                    isDragging: false,
                    dragStartCoords: null,
                    dragCurrentCoords: null,
                    currentSelection: new Set(),
                };
            };
        } catch (error) {
            console.error("Failed to initialize Three.js scene:", error);
        }
    }, []);

    // Grid interaction - Updated to handle both desktop and mobile grids
    useEffect(() => {
        const setupGridInteraction = (gridContainer) => {
            if (!gridContainer) return () => {};

            const getCellCoordsFromEvent = (event) => {
                const rect = gridContainer.getBoundingClientRect();
                const x = Math.floor(((event.clientX - rect.left) / rect.width) * GRID_SIZE);
                const z = Math.floor(((event.clientY - rect.top) / rect.height) * GRID_SIZE);

                if (x >= 0 && x < GRID_SIZE && z >= 0 && z < GRID_SIZE) {
                    return { x, z };
                }
                return null;
            };

            const handlePointerDown = (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                const coords = getCellCoordsFromEvent(e);
                if (coords) {
                    logicState.current.isDragging = true;
                    logicState.current.dragStartCoords = coords;
                    logicState.current.dragCurrentCoords = coords;
                    gridContainer.setPointerCapture(e.pointerId);
                    updateSelectionHighlight();
                }
            };
            
            const handlePointerMove = (e) => {
                if (logicState.current.isDragging) {
                    const coords = getCellCoordsFromEvent(e);
                    if (coords && (!logicState.current.dragCurrentCoords || coords.x !== logicState.current.dragCurrentCoords.x || coords.z !== logicState.current.dragCurrentCoords.z)) {
                        logicState.current.dragCurrentCoords = coords;
                        updateSelectionHighlight();
                    }
                }
            };

            const handlePointerUp = (e) => {
                if (logicState.current.isDragging) {
                    gridContainer.releasePointerCapture(e.pointerId);
                    logicState.current.isDragging = false;
                    const start = logicState.current.dragStartCoords;
                    const end = logicState.current.dragCurrentCoords || start;

                    if (start && end) {
                        const x1 = Math.min(start.x, end.x);
                        const z1 = Math.min(start.z, end.z);
                        const width = Math.abs(start.x - end.x) + 1;
                        const depth = Math.abs(start.z - end.z) + 1;
                        const brickData = createBrickMesh(x1, z1, width, depth, selectedColor);
                        addBrickToScene(brickData);
                    }
                    logicState.current.dragStartCoords = null;
                    logicState.current.dragCurrentCoords = null;
                    logicState.current.currentSelection.clear();
                    refreshGridAppearance();
                }
            };

            const handleContextMenu = (e) => e.preventDefault();

            gridContainer.addEventListener('pointerdown', handlePointerDown);
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
            gridContainer.addEventListener('contextmenu', handleContextMenu);

            return () => {
                gridContainer.removeEventListener('pointerdown', handlePointerDown);
                window.removeEventListener('pointermove', handlePointerMove);
                window.removeEventListener('pointerup', handlePointerUp);
                gridContainer.removeEventListener('contextmenu', handleContextMenu);
            };
        };

        // Setup interaction for desktop grid
        const desktopCleanup = setupGridInteraction(gridContainerRef.current);
        
        // Setup interaction for mobile grid
        const mobileCleanup = setupGridInteraction(mobileGridContainerRef.current);

        return () => {
            desktopCleanup();
            mobileCleanup();
        };
    }, [addBrickToScene, createBrickMesh, selectedColor, updateSelectionHighlight, refreshGridAppearance]);

    // Initialize grid cells
    useEffect(() => {
        const cells = [];
        for (let z = 0; z < GRID_SIZE; z++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                cells.push({ x, z, id: `cell-${x}-${z}` });
            }
        }
        setGridCells(cells);
        refreshGridAppearance();
    }, [refreshGridAppearance]);

    // Inject button styles
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.id = "rs-lego-builder-styles";
        styleSheet.innerText = `
          .clay-button {
            @apply flex-1 py-2 px-2.5 text-sm font-medium text-slate-700 text-center bg-slate-100 rounded-lg cursor-pointer transition-all duration-200 ease-in-out;
            box-shadow: -2px -2px 6px rgba(255, 255, 255, 0.8), 2px 2px 6px rgba(0, 0, 0, 0.15);
          }
          .clay-button:hover {
            background-color: #E9EEF5;
          }
          .clay-button:active {
            background-color: #E9EEF5;
            box-shadow: inset -2px -2px 6px rgba(255, 255, 255, 0.8), inset 2px 2px 6px rgba(0, 0, 0, 0.15);
            transform: scale(0.98);
          }
          .clay-button-special {
             @apply w-full bg-blue-100 text-blue-800;
             box-shadow: -2px -2px 6px rgba(255, 255, 255, 0.7), 2px 2px 8px rgba(0, 119, 255, 0.2);
          }
           .clay-button-special:hover {
             background-color: #D6E8FF;
           }
          .clay-button-special:active {
            background-color: #D6E8FF;
            box-shadow: inset -2px -2px 6px rgba(255, 255, 255, 0.7), inset 2px 2px 8px rgba(0, 119, 255, 0.2);
          }
        `;
        document.head.appendChild(styleSheet);
        return () => {
            const style = document.getElementById("rs-lego-builder-styles");
            if(style) {
                document.head.removeChild(style);
            }
        }
    }, []);

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full font-sans bg-gray-100 text-gray-800">
            {/* Left Panel: Controls - Desktop Always Visible */}
            <div className="hidden lg:flex lg:w-72 lg:flex-shrink-0 lg:border-r border-gray-300 bg-gray-200 p-4 flex-col">
                {/* Top Section */}
                <div>
                    <div className="flex flex-col items-center">
                        <img src={logoSrc} alt="Logo" className="w-[90px] h-auto mx-auto mb-3" />
                        <h2 className="text-xl font-semibold text-center">LEGO Builder</h2>
                    </div>
                    <div className="my-4 space-y-4">
                        <div>
                            <p className="text-sm font-medium text-center text-gray-700 mb-2">Select Color:</p>
                            <ColorPalette selectedColor={selectedColor} onColorSelect={setSelectedColor} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={handleUndo} className="clay-button text-sm py-2">Undo</button>
                                <button onClick={handleClearTopLayer} className="clay-button text-sm py-2">Clear Top</button>
                                <button onClick={handleClearAll} className="clay-button text-sm py-2">Clear All</button>
                                <button onClick={handleResetView} className="clay-button text-sm py-2">Reset View</button>
                            </div>
                            <button onClick={handleSaveAsPNG} className="clay-button clay-button-special text-sm py-2.5 flex items-center justify-center">
                                <Download className="w-4 h-4 mr-2" /> Save as PNG
                            </button>
                        </div>
                    </div>
                </div>

                {/* Middle Section (Centered) */}
                <div className="flex-grow flex flex-col justify-center">
                    <p className="text-sm font-medium text-center text-gray-700 mb-2">Define Brick on Grid:</p>
                    <div className="w-56 h-56 mx-auto">
                        <Grid2D gridSize={GRID_SIZE} gridContainerRef={gridContainerRef} gridCells={gridCells} />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-4 border-t border-gray-300 text-sm text-gray-600">
                    <p className="font-bold mb-2">Controls:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li><b>Click & Drag</b> on the 2D grid to place bricks.</li>
                        <li><b>Mouse Wheel:</b> Zoom in/out (3D View).</li>
                        <li><b>Click & Drag:</b> Rotate view (3D View).</li>
                    </ul>
                </div>
            </div>

            {/* 3D Scene Container - Now takes up remaining space properly */}
            <div className="flex-1 h-full w-full relative overflow-hidden bg-gray-50" ref={sceneContainerRef}>
                {/* Mobile Controls Overlay - Only visible on mobile (lg:hidden) */}
                <div className="lg:hidden">
                    {/* Floating Menu Toggle Button - Only on Mobile */}
                    <button 
                        className="fixed bottom-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg clay-button border border-gray-300"
                        onClick={() => setShowControlsPanel(!showControlsPanel)}
                        aria-label="Toggle controls panel"
                    >
                        {showControlsPanel ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Mobile Controls Panel - Slide up from bottom */}
                    <div className={`
                        fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-300 shadow-2xl 
                        transition-transform duration-300 ease-in-out transform rounded-t-2xl
                        ${showControlsPanel ? 'translate-y-0' : 'translate-y-full'}
                        max-h-[80vh] overflow-y-auto
                    `}>
                        <div className="p-4 space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                <div className="flex items-center gap-3">
                                    <img src={logoSrc} alt="Logo" className="w-12 h-12" />
                                    <h2 className="text-lg font-semibold">LEGO Builder</h2>
                                </div>
                                <button 
                                    onClick={() => setShowControlsPanel(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Color Selection */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Select Color:</p>
                                <ColorPalette selectedColor={selectedColor} onColorSelect={setSelectedColor} />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={handleUndo} className="clay-button">Undo</button>
                                    <button onClick={handleClearTopLayer} className="clay-button">Clear Top</button>
                                    <button onClick={handleClearAll} className="clay-button">Clear All</button>
                                    <button onClick={handleResetView} className="clay-button">Reset View</button>
                                </div>
                                <button onClick={handleSaveAsPNG} className="clay-button clay-button-special">
                                    <Download className="w-4 h-4 mr-2" /> Save as PNG
                                </button>
                            </div>

                            {/* 2D Grid - Mobile Version with separate ref */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Define Brick on Grid:</p>
                                <div className="flex justify-center">
                                    <div className="w-64 h-64">
                                        <Grid2D gridSize={GRID_SIZE} gridContainerRef={mobileGridContainerRef} gridCells={gridCells} />
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="pt-2 border-t border-gray-200 text-xs text-gray-600">
                                <p className="font-bold mb-1">Controls:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li><b>Tap & Drag</b> on the grid above to place bricks.</li>
                                    <li><b>Pinch:</b> Zoom in/out (3D View).</li>
                                    <li><b>One-Finger Drag:</b> Rotate view (3D View).</li>
                                    <li><b>Two-Finger Drag:</b> Pan view (3D View).</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Floating Buttons - visible when main panel is closed */}
                    {!showControlsPanel && (
                        <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2">
                            <button 
                                onClick={handleUndo} 
                                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg clay-button border border-gray-300"
                                title="Undo"
                            >
                                ↺
                            </button>
                            <button 
                                onClick={handleResetView} 
                                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg clay-button border border-gray-300"
                                title="Reset View"
                            >
                                ⌂
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
