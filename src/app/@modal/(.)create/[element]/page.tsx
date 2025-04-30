import EmptyMessage from "@/components/EmptyMessage/EmptyMessage"
import Modal from "@/components/Modal/Modal"
import NewElementForm from "@/components/NewElementForm/NewElementForm"

type ValidElements = 'group' | 'playlist'
const VALID_ELEMENTS = ['group', 'playlist']

const ELEMENT_MAP: Record<ValidElements, string> = {
    group: 'Grupo',
    playlist: 'Playlist'
}

type Params = Promise<{ element: string }>
export default async function CreateElement({ params }: { params: Params }) {

    const { element } = await params

    if(!VALID_ELEMENTS.includes(element)) {
        return <div>
            <EmptyMessage message={`Método ${element} invalido!`}/>
        </div>
    }

    return (
        <Modal
            size="small"
            header={`Criar nov${(element === 'group') ? 'o' : 'a'} ${ELEMENT_MAP[(element as ValidElements)]}`}
        >
            <NewElementForm 
                element={element as ('group' | 'playlist')} 
            />
        </Modal>
    )

}