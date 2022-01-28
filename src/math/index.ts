export class MathExtends {
    static RadianToDegree(radian: number): number {
        return radian * ( 180 / Math.PI );
    }

    static DegreeToRadian(degree: number): number {
        return degree * ( Math.PI / 180 );
    }
}