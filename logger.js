const log = (text, bgColor, textColor = 'white') => {
    // Kode untuk warna latar belakang
    const backgroundColors = {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        // warna latar belakang yang lebih cerah/abu-abu
        gray: "\x1b[100m", 
        brightRed: "\x1b[101m",
        brightGreen: "\x1b[102m",
        brightYellow: "\x1b[103m",
        brightBlue: "\x1b[104m",
        brightMagenta: "\x1b[105m",
        brightCyan: "\x1b[106m",
        brightWhite: "\x1b[107m"
    };

    // Kode untuk warna teks
    const foregroundColors = {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        // warna teks yang lebih cerah
        gray: "\x1b[90m",
        brightRed: "\x1b[91m",
        brightGreen: "\x1b[92m",
        brightYellow: "\x1b[93m",
        brightBlue: "\x1b[94m",
        brightMagenta: "\x1b[95m",
        brightCyan: "\x1b[96m",
        brightWhite: "\x1b[97m"
    };

    // Gunakan warna latar belakang default jika warna yang diberikan tidak valid
    const selectedBgColor = backgroundColors[bgColor] || "\x1b[40m"; // Default: hitam
    // Gunakan warna teks default jika warna yang diberikan tidak valid
    const selectedTextColor = foregroundColors[textColor] || "\x1b[37m"; // Default: putih

    const d = new Date();
    
    // Format tanggal dan waktu dengan nol di depan jika angkanya kurang dari 10
    const datePart = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
    const timePart = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

    // Gabungkan kode warna latar belakang dan teks, lalu reset semua format di akhir (\x1b[0m)
    console.log(`${selectedBgColor}${selectedTextColor}%s\x1b[0m`, `[${datePart} || ${timePart}] : ` + text);

};

module.exports = log;
