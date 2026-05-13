export function autoResize(textarea) {
    if(!textarea) return;
    const startScroll = window.scrollY;
    const startHeight = this.offsetHeight;

    requestAnimationFrame(() => {
        const originalTransition = this.style.transition;
        this.style.transition = 'none'; 

        this.style.setProperty('height', '45px', 'important');
        this.style.setProperty('min-height', '45px', 'important');

        const currentScrollHeight = this.scrollHeight;
        let finalHeightValue;

        if (!this.value.trim() || currentScrollHeight <= 45) { 
            finalHeightValue = 45;
        } else {
            finalHeightValue = currentScrollHeight;
        }

        const finalHeightStr = finalHeightValue + 'px';
        this.style.setProperty('height', finalHeightStr, 'important');
        this.style.setProperty('min-height', finalHeightStr, 'important');

        if (finalHeightValue > startHeight) {
            const diff = finalHeightValue - startHeight;
            window.scrollTo(0, startScroll + diff);
        } else {
            window.scrollTo(0, startScroll);
        }

        setTimeout(() => {
            this.style.transition = originalTransition;
        }, 0);
    });
}