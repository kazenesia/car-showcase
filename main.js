const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Warna background cerah
scene.clearColor = new BABYLON.Color3.FromHexString("#cceeff");

// Kamera awal (sebelum auto kamera)
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2.5, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// Cahaya global
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Load model .glb dari GitHub Pages
BABYLON.SceneLoader.Append("./assets/car_model.glb", scene, function () {
    console.log("✅ Model berhasil dimuat");

    // Auto buat kamera dan pencahayaan agar mengarah ke seluruh model
    scene.createDefaultCameraOrLight(true, true, true);
    scene.activeCamera.attachControl(canvas, true);

    // Tangani setiap mesh yang termuat
    scene.meshes.forEach(mesh => {
        // Perbesar model 200x agar terlihat di viewport
        mesh.scaling = new BABYLON.Vector3(200, 200, 200);
        mesh.isVisible = true;
        mesh.visibility = 1;
        mesh.showBoundingBox = true;

        // Paksa material agar tidak transparan
        if (mesh.material) {
            if (mesh.material.albedoColor) mesh.material.albedoColor = new BABYLON.Color3(1, 1, 1);
            if (mesh.material.diffuseColor) mesh.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
            if (mesh.material.alpha !== undefined) mesh.material.alpha = 1;
        }
    });

}, null, function (scene, message) {
    console.error("❌ Gagal memuat model:", message);
});

// Jalankan render loop
engine.runRenderLoop(() => {
    scene.render();
});
window.addEventListener("resize", () => engine.resize());
