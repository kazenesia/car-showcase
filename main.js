window.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.9, 0.95, 1, 1);

    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.2, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1.2;

    BABYLON.SceneLoader.Append("assets/", "car_model.gltf", scene, function () {
        console.log("✅ Model dimuat");

        // Tampilkan semua mesh dan ubah properti debug
        scene.meshes.forEach(mesh => {
            console.log("→ Mesh:", mesh.name, mesh.position);
            mesh.showBoundingBox = true;
            mesh.isVisible = true;
            mesh.visibility = 1;
            mesh.scaling = new BABYLON.Vector3(100, 100, 100); // perbesar 100x

            if (mesh.material) {
                if (mesh.material.alpha !== undefined) mesh.material.alpha = 1;
                if (mesh.material.albedoColor) mesh.material.albedoColor = new BABYLON.Color3(1, 1, 1);
                if (mesh.material.diffuseColor) mesh.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
            }
        });

        // Paksa kamera mengarah ulang ke pusat model
        scene.createDefaultCameraOrLight(true, true, true);
        scene.activeCamera.alpha += Math.PI;
        scene.activeCamera.radius = 1;
        scene.activeCamera.attachControl(canvas, true);
    }, null, function (scene, message) {
        console.error("❌ Gagal memuat model:", message);
    });

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
});
