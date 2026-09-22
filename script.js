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
// GENERAR IMAGEN DEL RESULTADO
// =========================================

async function generateResultImage(
    name1,
    name2,
    results
) {

    const canvas =
        document.createElement("canvas");

    canvas.width = 1080;
    canvas.height = 1920;

    const ctx =
        canvas.getContext("2d");

    // =========================================
    // FONDO
    // =========================================

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            1080,
            1920
        );

    gradient.addColorStop(
        0,
        "#ffd6e7"
    );

    gradient.addColorStop(
        0.5,
        "#f3d9ff"
    );

    gradient.addColorStop(
        1,
        "#d9e4ff"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        1080,
        1920
    );


    // =========================================
    // DECORACIÓN
    // =========================================

    ctx.font =
        "80px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "💕",
        150,
        180
    );

    ctx.fillText(
        "💘",
        930,
        180
    );

    ctx.font =
        "55px Arial";

    ctx.fillText(
        "✨",
        120,
        500
    );

    ctx.fillText(
        "✨",
        960,
        700
    );


    // =========================================
    // TÍTULO
    // =========================================

    ctx.fillStyle =
        "#8d3c68";

    ctx.font =
        "bold 70px Arial";

    ctx.fillText(
        "COMPATIBLES",
        540,
        300
    );


    // =========================================
    // NOMBRES
    // =========================================

    ctx.fillStyle =
        "#333333";

    ctx.font =
        "bold 55px Arial";

    ctx.fillText(
        `${name1} ❤️ ${name2}`,
        540,
        450
    );


    // =========================================
    // PORCENTAJE
    // =========================================

    ctx.fillStyle =
        "#d63384";

    ctx.font =
        "bold 190px Arial";

    ctx.fillText(
        `${results.compatibility}%`,
        540,
        720
    );


    ctx.fillStyle =
        "#555555";

    ctx.font =
        "bold 42px Arial";

    ctx.fillText(
        "DE COMPATIBILIDAD",
        540,
        790
    );


    // =========================================
    // MENSAJE
    // =========================================

    ctx.fillStyle =
        "#444444";

    ctx.font =
        "32px Arial";

    const message =
        getMessage(
            results.compatibility
        );

    drawWrappedText(
        ctx,
        message,
        540,
        900,
        850,
        48
    );


    // =========================================
    // MÉTRICAS
    // =========================================

    drawMetric(
        ctx,
        "🔥",
        "Química",
        results.chemistry,
        540,
        1110
    );

    drawMetric(
        ctx,
        "😂",
        "Diversión",
        results.fun,
        540,
        1230
    );

    drawMetric(
        ctx,
        "🧠",
        "Conexión",
        results.connection,
        540,
        1350
    );

    drawMetric(
        ctx,
        "💢",
        "Caos",
        results.chaos,
        540,
        1470
    );


    // =========================================
// CTA
// =========================================

ctx.fillStyle =
    "#8d3c68";

ctx.font =
    "bold 42px Arial";

ctx.fillText(
    "👀 ¿Será verdad?",
    540,
    1585
);


ctx.fillStyle =
    "#555555";

ctx.font =
    "bold 34px Arial";

ctx.fillText(
    "Haz tu propio test",
    540,
    1645
);


// =========================================
// ENLACE
// =========================================

ctx.fillStyle =
    "#d63384";

ctx.font =
    "bold 32px Arial";

ctx.fillText(
    "byloredev.github.io/compatibles",
    540,
    1715
);


// =========================================
// MARCA
// =========================================

ctx.fillStyle =
    "#777777";

ctx.font =
    "bold 30px Arial";

ctx.fillText(
    "♡ by LoreDev",
    540,
    1810
);

    // =========================================
    // CONVERTIR A ARCHIVO
    // =========================================

    return new Promise(
        (resolve) => {

            canvas.toBlob(
                (blob) => {

                    resolve(blob);

                },
                "image/png"
            );

        }
    );
}


// =========================================
// TEXTO ENVUELTO
// =========================================

function drawWrappedText(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
) {

    const words =
        text.split(" ");

    let line = "";

    for (
        let i = 0;
        i < words.length;
        i++
    ) {

        const testLine =
            line +
            words[i] +
            " ";

        const metrics =
            ctx.measureText(
                testLine
            );

        if (
            metrics.width >
                maxWidth &&
            i > 0
        ) {

            ctx.fillText(
                line,
                x,
                y
            );

            line =
                words[i] + " ";

            y += lineHeight;

        } else {

            line =
                testLine;

        }

    }

    ctx.fillText(
        line,
        x,
        y
    );
}


// =========================================
// MÉTRICA
// =========================================

function drawMetric(
    ctx,
    emoji,
    label,
    value,
    x,
    y
) {

    ctx.fillStyle =
        "#ffffff";

    ctx.beginPath();

    ctx.roundRect(
        180,
        y - 50,
        720,
        90,
        30
    );

    ctx.fill();


    ctx.fillStyle =
        "#444444";

    ctx.font =
        "bold 32px Arial";

    ctx.textAlign =
        "left";

    ctx.fillText(
        `${emoji} ${label}`,
        230,
        y + 12
    );


    ctx.textAlign =
        "right";

    ctx.fillStyle =
        "#d63384";

    ctx.fillText(
        `${value}%`,
        850,
        y + 12
    );


    ctx.textAlign =
        "center";
}

// =========================================
// COMPARTIR RESULTADO COMO IMAGEN
// =========================================

shareBtn.addEventListener(
    "click",
    async () => {

        const name1 =
            name1Input.value.trim();

        const name2 =
            name2Input.value.trim();

        const results =
            calculateCompatibility(
                name1,
                name2
            );

        // =========================================
        // ENLACE EXACTO DEL RESULTADO
        // =========================================

        const resultUrl =
            `${window.location.origin}${window.location.pathname}` +
            `?a=${encodeURIComponent(name1)}` +
            `&b=${encodeURIComponent(name2)}`;

        // =========================================
        // TEXTO QUE ACOMPAÑA LA IMAGEN
        // =========================================

        const shareText =
            `👀 ¿Tú cuánto sacarías?\n` +
            `Haz tu test aquí:\n` +
            `${resultUrl}`;

        shareBtn.textContent =
            "🖼️ CREANDO IMAGEN...";

        shareBtn.disabled = true;

        try {

            // =========================================
            // GENERAR IMAGEN
            // =========================================

            const blob =
                await generateResultImage(
                    name1,
                    name2,
                    results
                );

            const file =
                new File(
                    [blob],
                    "compatibles-resultado.png",
                    {
                        type: "image/png"
                    }
                );

            // =========================================
            // COMPARTIR IMAGEN + TEXTO + ENLACE
            // =========================================

            if (
                navigator.share &&
                navigator.canShare &&
                navigator.canShare({
                    files: [file]
                })
            ) {

                await navigator.share({

                    title:
                        "Compatibles 💘",

                    text:
                        shareText,

                    files:
                        [file]

                });

            } else {

                // =========================================
                // SI EL CELULAR NO SOPORTA COMPARTIR IMAGEN
                // =========================================

                const imageUrl =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href =
                    imageUrl;

                link.download =
                    "compatibles-resultado.png";

                document.body.appendChild(link);

                link.click();

                link.remove();

                URL.revokeObjectURL(
                    imageUrl
                );

                // Copiar también el texto + enlace
                await navigator.clipboard.writeText(
                    shareText
                );

                alert(
                    "🖼️ ¡Imagen guardada!\n\n" +
                    "También copiamos el texto y enlace para que puedas pegarlo al publicar 💕"
                );
            }

        } catch (error) {

            console.log(
                "Compartir cancelado:",
                error
            );

        } finally {

            shareBtn.disabled =
                false;

            shareBtn.textContent =
                "📸 COMPARTIR MI RESULTADO";

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