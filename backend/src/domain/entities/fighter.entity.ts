export class Fighter {
  constructor(
    public readonly id: number,
    public fullName: string,
    public nickname: string,
    public birthDate: Date,
    public height: number,
    public weight: number,
    public team: string,
    public weightClassId: number,
  ) {}
}
