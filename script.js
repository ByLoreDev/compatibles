/* =========================================
   💘 COMPATIBLES
   Algoritmo// ================================

 */
// ================================
// SUPABASE
// ================================

const SUPABASE_URL = "https://cukldolycpihymfurqvp.supabase.co";

const SUPABASE_KEY = "sb_publishable_3VjVpPcgHCRgByTuxhOWvw_s5YDu8Nu";


// ================================
// CONTADORES SUPABASE
// ================================

async function getStats() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/stats?id=eq.1&select=visitors,tests`,
            {
                method: "GET",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("No se pudieron obtener los contadores");
        }

        const data = await response.json();

        if (data.length > 0) {
            document.getElementById("visitors").textContent =
                data[0].visitors.toLocaleString("es-PE");

            document.getElementById("tests").textContent =
                data[0].tests.toLocaleString("es-PE");
        }

    } catch (error) {
        console.error("Error cargando estadísticas:", error);
    }
}


// Registrar visitante
async function registerVisitor() {
    try {
        if (sessionStorage.getItem("compatibles_visit")) {
            await getStats();
            return;
        }

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/increment_visitors`,
            {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo registrar la visita");
        }

        sessionStorage.setItem("compatibles_visit", "true");

        await getStats();

    } catch (error) {
        console.error("Error registrando visita:", error);
    }
}


// Registrar test
async function registerTest() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/increment_tests`,
            {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo registrar el test");
        }

        await getStats();

    } catch (error) {
        console.error("Error registrando test:", error);
    }
}

// ELEMENTOS DEL HTML
const homeScreen = document.getElementById("home");
const loadingScreen = document.getElementById("loading");
const resultScreen = document.getElementById("result");

// Cargar y registrar estadísticas
getStats();
registerVisitor(); 

const name1Input = document.getElementById("name1");
const name2Input = document.getElementById("name2");

const calculateBtn = document.getElementById("calculate-btn");
const shareBtn = document.getElementById("share-btn");
const againBtn = document.getElementById("again-btn");

const errorMessage = document.getElementById("error-message");

const loadingText = document.getElementById("loading-text");
const loadingProgress = document.getElementById("loading-progress");

const coupleNames = document.getElementById("couple-names");
const compatibilityScore = document.getElementById("compatibility-score");

const chemistry = document.getElementById("chemistry");
const fun = document.getElementById("fun");
const connection = document.getElementById("connection");
const chaos = document.getElementById("chaos");

const chemistryBar = document.getElementById("chemistry-bar");
const funBar = document.getElementById("fun-bar");
const connectionBar = document.getElementById("connection-bar");
const chaosBar = document.getElementById("chaos-bar");

const resultMessage = document.getElementById("result-message");

const testsCounter = document.getElementById("tests");


// =========================================
// FUNCIONES GENERALES
// =========================================

function showScreen(screen) {

    homeScreen.classList.remove("active");
    loadingScreen.classList.remove("active");
    resultScreen.classList.remove("active");

    screen.classList.add("active");

}


function cleanName(name) {

    return name
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


// =========================================
// GENERADOR DE NÚMERO
// =========================================

function generateSeed(text) {

    let hash = 0;

    for (let i = 0; i < text.length; i++) {

        hash =
            (hash << 5) -
            hash +
            text.charCodeAt(i);

        hash |= 0;
    }

    return Math.abs(hash);

}


// =========================================
// GENERAR NÚMERO ENTRE DOS VALORES
// =========================================

function randomFromSeed(seed, min, max) {

    return min + (seed % (max - min + 1));

}


// =========================================
// ALGORITMO PRINCIPAL
// =========================================

function calculateCompatibility(name1, name2) {

    const clean1 = cleanName(name1);
    const clean2 = cleanName(name2);


    // Ordenamos los nombres para que
    // Lorenna + Bryan sea igual que
    // Bryan + Lorenna.

    const names = [clean1, clean2].sort();

    const combined =
        names[0] +
        "💕" +
        names[1];


    const baseSeed = generateSeed(combined);


    // =====================================
    // RESULTADOS
    // =====================================

    const compatibility =
        randomFromSeed(
            baseSeed,
            55,
            98
        );


    const chemistry =
        randomFromSeed(
            baseSeed * 7,
            50,
            100
        );


    const fun =
        randomFromSeed(
            baseSeed * 13,
            50,
            100
        );


    const connection =
        randomFromSeed(
            baseSeed * 19,
            50,
            100
        );


    const chaos =
        randomFromSeed(
            baseSeed * 23,
            35,
            95
        );


    return {
        compatibility,
        chemistry,
        fun,
        connection,
        chaos
    };

}


// =========================================
// FRASES
// =========================================

function getMessage(score) {

    if (score >= 95) {

        return "🚨 Esto ya no parece coincidencia... ¡son demasiado compatibles! 💘";

    }

    if (score >= 90) {

        return "💍 Ustedes tienen una conexión peligrosamente buena. 👀";

    }

    if (score >= 80) {

        return "🔥 Hay química, risas y bastante potencial entre ustedes.";

    }

    if (score >= 70) {

        return "💕 Hay algo aquí... y el algoritmo lo está notando.";

    }

    if (score >= 60) {

        return "👀 Hay potencial, pero alguien tiene que dejar de hacerse el difícil.";

    }

    return "💀 El algoritmo recomienda una conversación seria.";

}


// =========================================
// VALIDACIÓN
// =========================================

function validateNames() {

    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();


    errorMessage.textContent = "";


    if (!name1 || !name2) {

        errorMessage.textContent =
            "💕 Necesitamos los dos nombres.";

        return false;
    }


    if (name1.length < 2 || name2.length < 2) {

        errorMessage.textContent =
            "👀 Escribe nombres completos o al menos 2 letras.";

        return false;
    }


    return true;

}


// =========================================
// ANIMACIÓN DE CARGA
// =========================================

function startLoading(callback) {

    showScreen(loadingScreen);


    let progress = 0;


    const messages = [
        "Consultando al algoritmo del amor 👀",
        "Analizando la química... 🔥",
        "Midiendo el nivel de caos... 💢",
        "Buscando señales de conexión... 🧠",
        "Calculando el resultado... 💕"
    ];


    let messageIndex = 0;


    loadingProgress.style.width = "0%";


    const interval = setInterval(() => {

        progress += Math.floor(
            Math.random() * 12
        ) + 5;


        if (progress > 100) {
            progress = 100;
        }


        loadingProgress.style.width =
            progress + "%";


        if (
            progress > 20 &&
            messageIndex < 1
        ) {

            messageIndex = 1;

            loadingText.textContent =
                messages[messageIndex];

        }


        if (
            progress > 40 &&
            messageIndex < 2
        ) {

            messageIndex = 2;

            loadingText.textContent =
                messages[messageIndex];

        }


        if (
            progress > 60 &&
            messageIndex < 3
        ) {

            messageIndex = 3;

            loadingText.textContent =
                messages[messageIndex];

        }


        if (
            progress > 80 &&
            messageIndex < 4
        ) {

            messageIndex = 4;

            loadingText.textContent =
                messages[messageIndex];

        }


        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                callback();

            }, 500);

        }

    }, 180);

}


// =========================================
// ANIMAR PORCENTAJES
// =========================================

function animateNumber(element, finalValue, duration = 1000) {

    const startTime = performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const value =
            Math.floor(
                progress * finalValue
            );


        element.textContent =
            value + "%";


        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }


    requestAnimationFrame(update);

}


// =========================================
// MOSTRAR RESULTADO
// =========================================

function showResult(name1, name2, results) {

    showScreen(resultScreen);


    coupleNames.textContent =
        `${name1} ❤️ ${name2}`;


    resultMessage.textContent =
        getMessage(results.compatibility);


    // Reiniciamos barras

    chemistryBar.style.width = "0%";
    funBar.style.width = "0%";
    connectionBar.style.width = "0%";
    chaosBar.style.width = "0%";


    chemistry.textContent = "0%";
    fun.textContent = "0%";
    connection.textContent = "0%";
    chaos.textContent = "0%";
    compatibilityScore.textContent = "0%";


    // Animación principal

    setTimeout(() => {

        animateNumber(
            compatibilityScore,
            results.compatibility,
            1200
        );

        animateNumber(
            chemistry,
            results.chemistry,
            1000
        );

        animateNumber(
            fun,
            results.fun,
            1000
        );

        animateNumber(
            connection,
            results.connection,
            1000
        );

        animateNumber(
            chaos,
            results.chaos,
            1000
        );


        chemistryBar.style.width =
            results.chemistry + "%";

        funBar.style.width =
            results.fun + "%";

        connectionBar.style.width =
            results.connection + "%";

        chaosBar.style.width =
            results.chaos + "%";

    }, 150);

}


// =========================================
// CALCULAR
// =========================================

calculateBtn.addEventListener(
    "click",
    () => {

        if (!validateNames()) {
            return;
        }


        const name1 =
            name1Input.value.trim();

        const name2 =
            name2Input.value.trim();


        const results =
            calculateCompatibility(
                name1,
                name2
            );

            registerTest();


        startLoading(() => {

            showResult(
                name1,
                name2,
                results
            );

        }); 

    }
);


// =========================================
// PROBAR NUEVAMENTE
// =========================================

againBtn.addEventListener(
    "click",
    () => {

        name1Input.value = "";
        name2Input.value = "";

        errorMessage.textContent = "";

        loadingProgress.style.width = "0%";

        showScreen(homeScreen);

        name1Input.focus();

    }
);


// =========================================
// COMPARTIR RESULTADO
// =========================================

shareBtn.addEventListener(
    "click",
    async () => {

        const name1 = name1Input.value.trim();
        const name2 = name2Input.value.trim();

        const score = compatibilityScore.textContent;

        // Crear enlace del resultado
        const resultUrl =
            `${window.location.origin}${window.location.pathname}` +
            `?a=${encodeURIComponent(name1)}` +
            `&b=${encodeURIComponent(name2)}`;

        const shareText =
            `💕 ${name1} ❤️ ${name2}\n\n` +
            `Tenemos ${score} de compatibilidad 💘\n\n` +
            `¿Qué tan compatibles son ustedes? 👀\n` +
            `Haz tu test aquí:`;

        // =========================================
        // COMPARTIR NATIVO DEL CELULAR
        // =========================================

        if (navigator.share) {

            try {

                await navigator.share({
                    title: "Compatibles 💘",
                    text: shareText,
                    url: resultUrl
                });

            } catch (error) {

                console.log("Compartir cancelado");

            }

        } else {

            // =========================================
            // COPIAR ENLACE
            // =========================================

            try {

                await navigator.clipboard.writeText(
                    `${shareText}\n${resultUrl}`
                );

                shareBtn.textContent =
                    "✅ ¡ENLACE COPIADO!";

                setTimeout(() => {

                    shareBtn.textContent =
                        "📸 COMPARTIR MI RESULTADO";

                }, 2000);

            } catch (error) {

                alert(
                    `Copia este enlace y compártelo 💕\n\n${resultUrl}`
                );

            }

        }

    }
);


// =========================================
// ENTER EN LOS INPUTS
// =========================================

name1Input.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            name2Input.focus();

        }

    }
);


name2Input.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            calculateBtn.click();

        }

    }
);

// =========================================
// CARGAR RESULTADO DESDE EL ENLACE
// =========================================

function loadSharedResult() {

    const params = new URLSearchParams(window.location.search);

    const name1 = params.get("a");
    const name2 = params.get("b");

    // Si no hay nombres en la URL, no hacemos nada
    if (!name1 || !name2) {
        return;
    }

    // Colocar los nombres en los inputs
    name1Input.value = name1;
    name2Input.value = name2;

    // Calcular el mismo resultado
    const results = calculateCompatibility(name1, name2);

    // Mostrar directamente el resultado
    showResult(name1, name2, results);
}
// Revisar si entramos mediante un enlace compartido
loadSharedResult();