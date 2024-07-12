export default function loadRazorpay(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (callback) {
        script.onload = callback;
    }
    document.head.appendChild(script);
}