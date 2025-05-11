const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Warna latar
scene.clearColor = new BABYLON.Color3.FromHexString("#cceeff");

// Kamera dinamis untuk framing otomatis
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2.5, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// Cahaya dasar
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Aktifkan debug layer
scene.debugLayer.show({
    embedMode: true
});

// Load model dengan path lengkap
BABYLON.SceneLoader.Append("./assets/car_model.glb", scene, function () {
    console.log("✅ Model berhasil dimuat.");

    // Tampilkan semua mesh dan bounding box
    scene.meshes.forEach(mesh => {
        console.log("Mesh:", mesh.name, mesh.position);
        mesh.showBoundingBox = true;
        mesh.isPickable = true;
    });

    // Auto fokus kamera ke seluruh scene
    scene.createDefaultCameraOrLight(true, true, true);
    scene.activeCamera.attachControl(canvas, true);
}, null, function (scene, message) {
    console.error("❌ Gagal memuat model:", message);
});

// Render loop
engine.runRenderLoop(() => {
    scene.render();
});
window.addEventListener("resize", () => engine.resize());
