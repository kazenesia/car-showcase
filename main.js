window.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Background cerah
    scene.clearColor = new BABYLON.Color4(0.95, 0.97, 1, 1);

    // Kamera orbit
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.2, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 50;

    // Pencahayaan
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1.2;

    // Muat model GLTF
    BABYLON.SceneLoader.ImportMesh(null, "assets/", "car_model.gltf", scene, function (meshes) {
        console.log("✅ Model berhasil dimuat");

        // Group semua mesh ke dalam satu root
        const root = new BABYLON.TransformNode("carRoot", scene);
        meshes.forEach(mesh => {
            mesh.parent = root;
        });

        // Skalakan agar model terlihat besar
        root.scaling = new BABYLON.Vector3(200, 200, 200);
        root.position = new BABYLON.Vector3(0, 0, 0);

        // Fokus kamera ke model
        camera.target = root.position;
    }, null, function (scene, message) {
        console.error("❌ Gagal memuat model:", message);
    });

    // Render scene
    engine.runRenderLoop(() => {
        scene.render();
    });

    // Resize responsif
    window.addEventListener('resize', () => {
        engine.resize();
    });
});
