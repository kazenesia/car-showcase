const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Warna latar biru muda
scene.clearColor = new BABYLON.Color3.FromHexString("#cceeff");

// Kamera dan cahaya
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2.5, 20, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 1;

// Lingkungan
scene.createDefaultEnvironment({
    createGround: true,
    groundYBias: 1,
    skyboxColor: new BABYLON.Color3.FromHexString("#cceeff"),
    enableGroundShadow: true
});

// GUI info
const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
const infoPanel = new BABYLON.GUI.Rectangle();
infoPanel.width = "300px";
infoPanel.height = "100px";
infoPanel.cornerRadius = 10;
infoPanel.color = "white";
infoPanel.thickness = 2;
infoPanel.background = "black";
infoPanel.alpha = 0.8;
infoPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
infoPanel.top = "-20px";
infoPanel.isVisible = false;
gui.addControl(infoPanel);

const infoText = new BABYLON.GUI.TextBlock();
infoText.color = "white";
infoText.fontSize = 14;
infoPanel.addControl(infoText);

function showInfo(title, description) {
    infoText.text = `${title}\n${description}`;
    infoPanel.isVisible = true;
}
function hideInfo() {
    infoPanel.isVisible = false;
}

// Load model .glb dari GitHub Pages
BABYLON.SceneLoader.Append("./assets/car_model.glb", scene, function () {
    console.log("Model loaded!");
    scene.meshes.forEach(mesh => console.log("Mesh:", mesh.name));

    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
            const picked = pointerInfo.pickInfo.pickedMesh;
            if (!picked) return;

            console.log("Clicked:", picked.name);
            showInfo("Bagian Mobil", `Nama mesh: ${picked.name}`);
        }
    });
}, null, function (scene, message) {
    console.error("Error loading model:", message);
});

// Render
engine.runRenderLoop(() => {
    scene.render();
});
window.addEventListener("resize", () => engine.resize());
