const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Warna background
scene.clearColor = new BABYLON.Color3.FromHexString("#cceeff");

// Kamera dan cahaya dasar
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2.5, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 1;

// Load model .glb
BABYLON.SceneLoader.Append("./assets/car_model.glb", scene, function () {
    console.log("✅ Model berhasil dimuat!");

    // Perbesar model kecil & tampilkan
    scene.meshes.forEach(mesh => {
        mesh.scaling = new BABYLON.Vector3(200, 200, 200); // model sangat kecil aslinya
        mesh.isVisible = true;
        mesh.visibility = 1;
        mesh.showBoundingBox = true;

        // Perbaiki material jika ada
        if (mesh.material) {
            if (mesh.material.albedoColor) mesh.material.albedoColor = new BABYLON.Color3(1, 1, 1);
            if (mesh.material.diffuseColor) mesh.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
            mesh.material.alpha = 1;
        }
    });

    // Auto buat kamera dan arahkan fokus ke model
    scene.createDefaultCameraOrLight(true, true, true);
    scene.activeCamera.attachControl(canvas, true);
    scene.activeCamera.alpha += Math.PI;
    scene.activeCamera.radius = 1; // radius kecil agar dekat ke model

}, null, function (scene, message) {
    console.error("❌ Gagal memuat model:", message);
});

// Render loop
engine.runRenderLoop(() => {
    scene.render();
});
window.addEventListener("resize", () => engine.resize());
