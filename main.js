window.addEventListener('DOMContentLoaded', function () {
    // Dapatkan canvas dari HTML
    const canvas = document.getElementById('renderCanvas');

    // Buat engine Babylon.js
    const engine = new BABYLON.Engine(canvas, true);

    // Buat scene baru
    const scene = new BABYLON.Scene(engine);

    // Ubah warna background menjadi cerah (misal: putih kebiruan)
    scene.clearColor = new BABYLON.Color4(0.9, 0.95, 1, 1);

    // Tambahkan kamera
    const camera = new BABYLON.ArcRotateCamera(
        "Camera",
        BABYLON.Tools.ToRadians(135),
        BABYLON.Tools.ToRadians(70),
        10,
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 20;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 50;

    // Tambahkan pencahayaan
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1.2;

    // Tambahkan ground (opsional)
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    ground.material = groundMaterial;
    ground.receiveShadows = true;

    // Load model GLTF (dengan car_model.gltf dan car_model.bin)
    BABYLON.SceneLoader.ImportMesh(
        null,
        "assets/",
        "car_model.gltf",
        scene,
        function (meshes) {
            console.log("Model berhasil dimuat:", meshes);

            const car = meshes[0];
            car.position = new BABYLON.Vector3(0, 0, 0);
            car.scaling = new BABYLON.Vector3(1, 1, 1);
        },
        null,
        function (scene, message, exception) {
            console.error("Gagal memuat model:", message, exception);
        }
    );

    // Render scene
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Resize event
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
